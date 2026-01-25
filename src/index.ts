import { Env, CreateFeedbackRequest, FeedbackQueueMessage } from './types';
import { DatabaseService } from './database-service';
import { AIService } from './ai-service';
import { VectorSearchService } from './vector-service';
import { queueConsumer } from './queue-consumer';
import { mockFeedbackData } from './mock-data';

export default {
  /**
   * Main fetch handler
   */
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Initialize services
      const dbService = new DatabaseService(env);
      const aiService = new AIService(env);
      const vectorService = new VectorSearchService(env, aiService);

      // Routes
      if (path === '/' && request.method === 'GET') {
        return new Response(JSON.stringify({
          name: 'Feedback Dashboard API',
          version: '1.0.0',
          endpoints: {
            'GET /': 'API information',
            'GET /products': 'List all products',
            'GET /products/:id': 'Get product details',
            'GET /products/:id/feedback': 'Get feedback for a product',
            'GET /products/:id/stats': 'Get feedback statistics',
            'GET /products/:id/search': 'Search feedback (query param: q)',
            'GET /products/:id/semantic-search': 'Semantic search (query param: q)',
            'POST /feedback': 'Submit new feedback',
            'POST /load-mock-data': 'Load test data',
            'GET /feedback/:id': 'Get specific feedback',
            'GET /feedback/:id/similar': 'Find similar feedback',
            'GET /sources': 'List feedback sources'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Get all products
      if (path === '/products' && request.method === 'GET') {
        const products = await dbService.getProducts();
        return jsonResponse(products, corsHeaders);
      }

      // Get product by ID
      if (path.match(/^\/products\/\d+$/) && request.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const product = await dbService.getProduct(id);
        if (!product) {
          return jsonResponse({ error: 'Product not found' }, corsHeaders, 404);
        }
        return jsonResponse(product, corsHeaders);
      }

      // Get feedback for a product
      if (path.match(/^\/products\/\d+\/feedback$/) && request.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const feedback = await dbService.getFeedbackByProduct(id, limit);
        return jsonResponse(feedback, corsHeaders);
      }

      // Get stats for a product
      if (path.match(/^\/products\/\d+\/stats$/) && request.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const stats = await dbService.getFeedbackStats(id);
        return jsonResponse(stats, corsHeaders);
      }

      // Search feedback (text search)
      if (path.match(/^\/products\/\d+\/search$/) && request.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const query = url.searchParams.get('q');
        if (!query) {
          return jsonResponse({ error: 'Query parameter "q" required' }, corsHeaders, 400);
        }
        const results = await dbService.searchFeedback(id, query);
        return jsonResponse(results, corsHeaders);
      }

      // Semantic search
      if (path.match(/^\/products\/\d+\/semantic-search$/) && request.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const query = url.searchParams.get('q');
        if (!query) {
          return jsonResponse({ error: 'Query parameter "q" required' }, corsHeaders, 400);
        }
        const results = await vectorService.searchSimilar(query, id, 10);
        
        // Fetch full feedback for results
        const feedbackIds = results.map(r => r.feedbackId);
        const feedbackData = [];
        for (const fid of feedbackIds) {
          const fb = await dbService.getFeedback(fid);
          if (fb) {
            feedbackData.push({
              ...fb,
              similarity_score: results.find(r => r.feedbackId === fid)?.score
            });
          }
        }
        
        return jsonResponse(feedbackData, corsHeaders);
      }

      // Submit new feedback
      if (path === '/feedback' && request.method === 'POST') {
        const data: CreateFeedbackRequest = await request.json();
        
        // Validate required fields
        if (!data.product_id || !data.source_name || !data.content) {
          return jsonResponse(
            { error: 'Missing required fields: product_id, source_name, content' },
            corsHeaders,
            400
          );
        }

        // Create feedback
        const feedbackId = await dbService.createFeedback(data);
        
        // Queue for processing
        await env.FEEDBACK_QUEUE.send({
          feedbackId,
          action: 'process'
        } as FeedbackQueueMessage);

        return jsonResponse({
          success: true,
          feedback_id: feedbackId,
          message: 'Feedback submitted and queued for processing'
        }, corsHeaders, 201);
      }

      // Get specific feedback
      if (path.match(/^\/feedback\/\d+$/) && request.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const feedback = await dbService.getFeedback(id);
        if (!feedback) {
          return jsonResponse({ error: 'Feedback not found' }, corsHeaders, 404);
        }
        return jsonResponse(feedback, corsHeaders);
      }

      // Find similar feedback
      if (path.match(/^\/feedback\/\d+\/similar$/) && request.method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const similar = await vectorService.findSimilar(id, 5);
        
        // Fetch full feedback
        const feedbackData = [];
        for (const s of similar) {
          const fb = await dbService.getFeedback(s.feedbackId);
          if (fb) {
            feedbackData.push({ ...fb, similarity_score: s.score });
          }
        }
        
        return jsonResponse(feedbackData, corsHeaders);
      }

      // Get feedback sources
      if (path === '/sources' && request.method === 'GET') {
        const sources = await dbService.getFeedbackSources();
        return jsonResponse(sources, corsHeaders);
      }

      // Load mock data
      if (path === '/load-mock-data' && request.method === 'POST') {
        const results = [];
        for (const mockFeedback of mockFeedbackData) {
          try {
            const feedbackId = await dbService.createFeedback(mockFeedback);
            
            // Queue for processing
            await env.FEEDBACK_QUEUE.send({
              feedbackId,
              action: 'process'
            } as FeedbackQueueMessage);
            
            results.push({ success: true, feedback_id: feedbackId });
          } catch (error) {
            results.push({ success: false, error: String(error) });
          }
        }
        
        return jsonResponse({
          message: 'Mock data loaded',
          results
        }, corsHeaders);
      }

      // 404 - Not found
      return jsonResponse({ error: 'Endpoint not found' }, corsHeaders, 404);

    } catch (error) {
      console.error('Error:', error);
      return jsonResponse({
        error: 'Internal server error',
        details: String(error)
      }, corsHeaders, 500);
    }
  },

  /**
   * Queue consumer handler
   */
  async queue(batch: MessageBatch<FeedbackQueueMessage>, env: Env): Promise<void> {
    await queueConsumer(batch, env);
  }
};

/**
 * Helper function to create JSON responses
 */
function jsonResponse(data: any, headers: Record<string, string>, status: number = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    }
  });
}
