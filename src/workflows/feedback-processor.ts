import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';

// Workflow environment with bindings
interface Env {
  DB: D1Database;
  AI: Ai;
  VECTORIZE: VectorizeIndex;
}

// Workflow parameters
interface FeedbackProcessorParams {
  feedbackId: number;
}

// Step results
interface FeedbackData {
  id: number;
  product_id: number;
  title: string | null;
  content: string;
  status: string;
}

interface AnalysisResult {
  sentiment_score: number;
  sentiment_label: 'positive' | 'negative' | 'neutral';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface EmbeddingResult {
  vector: number[];
  indexed: boolean;
}

/**
 * Feedback Processing Workflow
 *
 * A durable workflow that processes feedback through:
 * 1. Fetch feedback from D1
 * 2. Analyze with Workers AI
 * 3. Update D1 with analysis
 * 4. Generate embedding and index in Vectorize
 */
export class FeedbackProcessorWorkflow extends WorkflowEntrypoint<Env, FeedbackProcessorParams> {

  async run(event: WorkflowEvent<FeedbackProcessorParams>, step: WorkflowStep) {
    const { feedbackId } = event.payload;

    // Step 1: Fetch feedback from database
    const feedback = await step.do('fetch-feedback', async () => {
      const result = await this.env.DB.prepare(
        'SELECT id, product_id, title, content, status FROM feedback WHERE id = ?'
      ).bind(feedbackId).first<FeedbackData>();

      if (!result) {
        throw new Error(`Feedback ${feedbackId} not found`);
      }

      return result;
    });

    // Step 2: Analyze with Workers AI
    const analysis = await step.do('analyze-feedback', async () => {
      const textToAnalyze = feedback.title
        ? `${feedback.title}\n\n${feedback.content}`
        : feedback.content;

      const prompt = `Analyze this customer feedback and respond with ONLY a JSON object (no markdown, no explanation):

Feedback: "${textToAnalyze}"

Return exactly this JSON format:
{
  "sentiment_score": <number from -1 to 1>,
  "sentiment_label": "<positive|negative|neutral>",
  "category": "<bug|feature_request|ux_issue|performance|documentation|pricing|praise|other>",
  "priority": "<low|medium|high|critical>"
}`;

      const response = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a feedback analysis assistant. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200
      });

      // Parse the AI response
      const responseText = (response as any).response || '';

      try {
        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            sentiment_score: Number(parsed.sentiment_score) || 0,
            sentiment_label: parsed.sentiment_label || 'neutral',
            category: parsed.category || 'other',
            priority: parsed.priority || 'medium'
          } as AnalysisResult;
        }
      } catch (e) {
        console.error('Failed to parse AI response:', responseText);
      }

      // Fallback analysis
      return {
        sentiment_score: 0,
        sentiment_label: 'neutral' as const,
        category: 'other',
        priority: 'medium' as const
      };
    });

    // Step 3: Update database with analysis
    await step.do('update-database', async () => {
      await this.env.DB.prepare(`
        UPDATE feedback
        SET sentiment_score = ?,
            sentiment_label = ?,
            category = ?,
            priority = ?,
            status = 'processed',
            processed_at = datetime('now')
        WHERE id = ?
      `).bind(
        analysis.sentiment_score,
        analysis.sentiment_label,
        analysis.category,
        analysis.priority,
        feedbackId
      ).run();

      return { updated: true };
    });

    // Step 4: Generate embedding and index in Vectorize
    const embedding = await step.do('generate-embedding', async () => {
      const textToEmbed = feedback.title
        ? `${feedback.title} ${feedback.content}`
        : feedback.content;

      // Generate embedding using Workers AI
      const embeddingResponse = await this.env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: textToEmbed
      });

      const vector = (embeddingResponse as any).data?.[0] || [];

      if (vector.length === 0) {
        console.error('Failed to generate embedding');
        return { vector: [], indexed: false };
      }

      return { vector, indexed: false };
    });

    // Step 5: Index in Vectorize (separate step for durability)
    if (embedding.vector.length > 0) {
      await step.do('index-vectorize', async () => {
        await this.env.VECTORIZE.upsert([{
          id: feedbackId.toString(),
          values: embedding.vector,
          metadata: {
            feedbackId: feedbackId,
            productId: feedback.product_id,
            title: feedback.title || '',
            category: analysis.category,
            sentiment: analysis.sentiment_label
          }
        }]);

        return { indexed: true };
      });
    }

    // Return final result
    return {
      feedbackId,
      status: 'processed',
      analysis: {
        sentiment: analysis.sentiment_label,
        category: analysis.category,
        priority: analysis.priority
      },
      indexed: embedding.vector.length > 0
    };
  }
}
