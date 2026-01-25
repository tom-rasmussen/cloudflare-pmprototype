import { Env, CreateFeedbackRequest } from './types';
import { DatabaseService } from './database-service';
import { AIService } from './ai-service';
import { VectorSearchService } from './vector-service';
import { mockFeedbackData } from './mock-data';
import { DASHBOARD_HTML } from './dashboard';

// Re-export the Workflow class for Cloudflare to discover
export { FeedbackProcessorWorkflow } from './workflows/feedback-processor';

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

      // Serve dashboard UI
      if ((path === '/' || path === '/dashboard') && request.method === 'GET') {
        return new Response(DASHBOARD_HTML, {
          headers: { 'Content-Type': 'text/html' }
        });
      }

      // API info
      if (path === '/api' && request.method === 'GET') {
        return new Response(JSON.stringify({
          name: 'Feedback Dashboard API',
          version: '2.0.0',
          description: 'Now powered by Cloudflare Workflows',
          endpoints: {
            'GET /': 'Dashboard UI',
            'GET /api': 'API information',
            'GET /products': 'List all products',
            'GET /products/:id': 'Get product details',
            'GET /products/:id/feedback': 'Get feedback for a product',
            'GET /products/:id/stats': 'Get feedback statistics',
            'GET /products/:id/search': 'Search feedback (query param: q)',
            'GET /products/:id/semantic-search': 'Semantic search (query param: q)',
            'POST /feedback': 'Submit new feedback (triggers workflow)',
            'GET /feedback/:id': 'Get specific feedback',
            'GET /feedback/:id/similar': 'Find similar feedback',
            'GET /workflow/:id': 'Get workflow status',
            'POST /load-mock-data': 'Load test data',
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

      // Submit new feedback - triggers Workflow
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

        // Create feedback in database
        const feedbackId = await dbService.createFeedback(data);

        // Trigger the processing workflow
        const workflowInstance = await env.FEEDBACK_WORKFLOW.create({
          id: `feedback-${feedbackId}-${Date.now()}`,
          params: { feedbackId }
        });

        return jsonResponse({
          success: true,
          feedback_id: feedbackId,
          workflow_id: workflowInstance.id,
          message: 'Feedback submitted and workflow started'
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

      // Get workflow status
      if (path.match(/^\/workflow\/[\w-]+$/) && request.method === 'GET') {
        const workflowId = path.split('/')[2];
        try {
          const instance = await env.FEEDBACK_WORKFLOW.get(workflowId);
          const status = await instance.status();
          return jsonResponse({
            workflow_id: workflowId,
            ...status
          }, corsHeaders);
        } catch (error) {
          return jsonResponse({
            error: 'Workflow not found',
            workflow_id: workflowId
          }, corsHeaders, 404);
        }
      }

      // Get feedback sources
      if (path === '/sources' && request.method === 'GET') {
        const sources = await dbService.getFeedbackSources();
        return jsonResponse(sources, corsHeaders);
      }

      // Load mock data - triggers workflows for each item
      if (path === '/load-mock-data' && request.method === 'POST') {
        const results = [];
        for (const mockFeedback of mockFeedbackData) {
          try {
            const feedbackId = await dbService.createFeedback(mockFeedback);

            // Trigger workflow for processing
            const workflowInstance = await env.FEEDBACK_WORKFLOW.create({
              id: `feedback-${feedbackId}-${Date.now()}`,
              params: { feedbackId }
            });

            results.push({
              success: true,
              feedback_id: feedbackId,
              workflow_id: workflowInstance.id
            });
          } catch (error) {
            results.push({ success: false, error: String(error) });
          }
        }

        return jsonResponse({
          message: 'Mock data loaded and workflows started',
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
