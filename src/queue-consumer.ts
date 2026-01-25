import { Env, FeedbackQueueMessage } from './types';
import { DatabaseService } from './database-service';
import { AIService } from './ai-service';
import { VectorSearchService } from './vector-service';

/**
 * Queue consumer handler for processing feedback
 */
export async function queueConsumer(
  batch: MessageBatch<FeedbackQueueMessage>,
  env: Env
): Promise<void> {
  const dbService = new DatabaseService(env);
  const aiService = new AIService(env);
  const vectorService = new VectorSearchService(env, aiService);

  console.log(`Processing batch of ${batch.messages.length} messages`);

  for (const message of batch.messages) {
    try {
      const { feedbackId, action } = message.body;

      console.log(`Processing feedback ${feedbackId} with action: ${action}`);

      // Get feedback from database
      const feedback = await dbService.getFeedback(feedbackId);
      
      if (!feedback) {
        console.error(`Feedback ${feedbackId} not found`);
        message.ack();
        continue;
      }

      switch (action) {
        case 'process':
          await processFeedback(feedback, dbService, aiService, vectorService);
          break;
        case 'analyze':
          await analyzeFeedback(feedback, dbService, aiService);
          break;
        case 'embed':
          await embedFeedback(feedback, vectorService);
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }

      // Acknowledge message after successful processing
      message.ack();
      console.log(`Successfully processed feedback ${feedbackId}`);
    } catch (error) {
      console.error(`Error processing message:`, error);
      // Message will be retried automatically
      message.retry();
    }
  }
}

/**
 * Full processing pipeline: analyze + embed
 */
async function processFeedback(
  feedback: any,
  dbService: DatabaseService,
  aiService: AIService,
  vectorService: VectorSearchService
): Promise<void> {
  // Analyze with AI
  const analysis = await aiService.analyzeFeedback(feedback.content, feedback.title);
  
  // Update database
  await dbService.updateFeedbackAnalysis(
    feedback.id,
    analysis.sentiment.score,
    analysis.sentiment.label,
    analysis.category,
    analysis.priority
  );
  
  // Index in Vectorize
  const updatedFeedback = await dbService.getFeedback(feedback.id);
  if (updatedFeedback) {
    await vectorService.indexFeedback(updatedFeedback);
  }
}

/**
 * Just analyze feedback (no embedding)
 */
async function analyzeFeedback(
  feedback: any,
  dbService: DatabaseService,
  aiService: AIService
): Promise<void> {
  const analysis = await aiService.analyzeFeedback(feedback.content, feedback.title);
  
  await dbService.updateFeedbackAnalysis(
    feedback.id,
    analysis.sentiment.score,
    analysis.sentiment.label,
    analysis.category,
    analysis.priority
  );
}

/**
 * Just create embedding (assumes already analyzed)
 */
async function embedFeedback(
  feedback: any,
  vectorService: VectorSearchService
): Promise<void> {
  await vectorService.indexFeedback(feedback);
}
