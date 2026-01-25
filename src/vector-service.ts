import { Env, VectorMetadata, Feedback } from './types';
import { AIService } from './ai-service';

export class VectorSearchService {
  constructor(private env: Env, private aiService: AIService) {}

  /**
   * Add feedback to vector index for semantic search
   */
  async indexFeedback(feedback: Feedback): Promise<void> {
    try {
      // Create searchable text from feedback
      const searchText = this.createSearchText(feedback);
      
      // Generate embedding
      const embedding = await this.aiService.generateEmbedding(searchText);
      
      // Create metadata
      const metadata: VectorMetadata = {
        feedbackId: feedback.id,
        productId: feedback.product_id,
        title: feedback.title || undefined,
        snippet: feedback.content.substring(0, 200),
        category: feedback.category || undefined,
        sentiment: feedback.sentiment_label || undefined
      };
      
      // Upsert to Vectorize
      await this.env.VECTORIZE.upsert([
        {
          id: `feedback-${feedback.id}`,
          values: embedding,
          metadata: metadata as Record<string, string | number | boolean>
        }
      ]);
      
      console.log(`Indexed feedback ${feedback.id} in Vectorize`);
    } catch (error) {
      console.error(`Error indexing feedback ${feedback.id}:`, error);
      throw error;
    }
  }

  /**
   * Search feedback using semantic similarity
   */
  async searchSimilar(
    query: string, 
    productId: number, 
    limit: number = 10
  ): Promise<Array<{ feedbackId: number; score: number; metadata: VectorMetadata }>> {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.aiService.generateEmbedding(query);
      
      // Search Vectorize
      const results = await this.env.VECTORIZE.query(queryEmbedding, {
        topK: limit * 2, // Get more results initially to filter by product
        returnMetadata: true,
        returnValues: false
      });
      
      // Filter by product and format results
      const filtered = results.matches
        .filter(match => match.metadata?.productId === productId)
        .slice(0, limit)
        .map(match => ({
          feedbackId: match.metadata?.feedbackId as number,
          score: match.score || 0,
          metadata: match.metadata as VectorMetadata
        }));
      
      return filtered;
    } catch (error) {
      console.error('Vector search error:', error);
      return [];
    }
  }

  /**
   * Find similar feedback items
   */
  async findSimilar(
    feedbackId: number,
    limit: number = 5
  ): Promise<Array<{ feedbackId: number; score: number }>> {
    try {
      // Get the vector for this feedback
      const vector = await this.env.VECTORIZE.getByIds([`feedback-${feedbackId}`]);
      
      if (vector.length === 0) {
        return [];
      }
      
      const feedbackVector = vector[0];
      
      // Search for similar vectors
      const results = await this.env.VECTORIZE.query(feedbackVector.values, {
        topK: limit + 1, // +1 to exclude self
        returnMetadata: true,
        returnValues: false
      });
      
      // Filter out self and format
      return results.matches
        .filter(match => match.id !== `feedback-${feedbackId}`)
        .slice(0, limit)
        .map(match => ({
          feedbackId: match.metadata?.feedbackId as number,
          score: match.score || 0
        }));
    } catch (error) {
      console.error('Find similar error:', error);
      return [];
    }
  }

  /**
   * Remove feedback from vector index
   */
  async removeFromIndex(feedbackId: number): Promise<void> {
    try {
      await this.env.VECTORIZE.deleteByIds([`feedback-${feedbackId}`]);
      console.log(`Removed feedback ${feedbackId} from Vectorize`);
    } catch (error) {
      console.error(`Error removing feedback ${feedbackId}:`, error);
    }
  }

  /**
   * Create searchable text from feedback
   */
  private createSearchText(feedback: Feedback): string {
    const parts: string[] = [];
    
    if (feedback.title) {
      parts.push(feedback.title);
    }
    
    parts.push(feedback.content);
    
    if (feedback.category) {
      parts.push(`Category: ${feedback.category}`);
    }
    
    return parts.join(' ');
  }
}
