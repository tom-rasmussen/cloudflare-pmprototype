import { Env, CreateFeedbackRequest } from './types';
import { DatabaseService } from './database-service';
import { AIService } from './ai-service';
import { VectorSearchService } from './vector-service';
import { WebhookParser, mockWebhooks } from './webhook-parser';
import { mockFeedbackData } from './mock-data';
import { DASHBOARD_HTML } from './dashboard';

// Re-export the Workflow class for Cloudflare to discover
export { FeedbackProcessorWorkflow } from './workflows/feedback-processor';

/**
 * FRICTION POINTS NOTED IN THIS FILE:
 *
 * 1. No built-in router - manual path matching is verbose and error-prone
 * 2. CORS handling must be done manually for every response
 * 3. Request body parsing requires manual JSON.parse with error handling
 * 4. No middleware support - auth/logging must be duplicated
 * 5. Path parameter extraction is manual (regex + split)
 */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Initialize services
      const dbService = new DatabaseService(env);
      const aiService = new AIService(env);
      const vectorService = new VectorSearchService(env, aiService);
      const webhookParser = new WebhookParser(env);

      // ============================================
      // DASHBOARD UI
      // ============================================

      if ((path === '/' || path === '/dashboard') && method === 'GET') {
        return new Response(DASHBOARD_HTML, {
          headers: { 'Content-Type': 'text/html' }
        });
      }

      // ============================================
      // API INFO
      // ============================================

      if (path === '/api' && method === 'GET') {
        return jsonResponse({
          name: 'PM Feedback Dashboard API',
          version: '3.0.0',
          description: 'Product feedback management with AI-powered analysis',
          cloudflare_tech: ['Workers', 'D1', 'Workers AI', 'Vectorize', 'Workflows'],
          endpoints: {
            products: {
              'GET /products': 'List all products',
              'GET /products/:id': 'Get product details',
              'POST /products': 'Create new product',
              'PUT /products/:id': 'Update product',
              'DELETE /products/:id': 'Delete product'
            },
            feedback: {
              'GET /products/:id/feedback': 'Get feedback for product',
              'GET /products/:id/kanban': 'Get feedback grouped by status',
              'POST /feedback': 'Create feedback manually',
              'GET /feedback/:id': 'Get specific feedback',
              'PUT /feedback/:id': 'Update feedback',
              'PATCH /feedback/:id/status': 'Update feedback status',
              'DELETE /feedback/:id': 'Delete feedback'
            },
            webhooks: {
              'POST /webhooks/:source': 'Receive webhook (discord, slack, github, twitter, email)',
              'POST /webhooks/test/:source': 'Generate mock webhook data'
            },
            analytics: {
              'GET /products/:id/stats': 'Get feedback statistics',
              'GET /products/:id/analytics': 'Get pie chart data',
              'GET /analytics': 'Get global analytics'
            },
            search: {
              'GET /products/:id/search': 'Text search',
              'GET /products/:id/semantic-search': 'AI-powered search'
            },
            other: {
              'GET /sources': 'List feedback sources',
              'POST /load-mock-data': 'Load test data'
            }
          }
        }, corsHeaders);
      }

      // ============================================
      // PRODUCT CRUD
      // ============================================

      // List products
      if (path === '/products' && method === 'GET') {
        const products = await dbService.getProducts();
        return jsonResponse(products, corsHeaders);
      }

      // Create product
      if (path === '/products' && method === 'POST') {
        const body = await request.json() as any;
        if (!body.name) {
          return jsonResponse({ error: 'Product name is required' }, corsHeaders, 400);
        }
        const id = await dbService.createProduct(
          body.name,
          body.description || '',
          body.category || 'General'
        );
        return jsonResponse({ success: true, id, message: 'Product created' }, corsHeaders, 201);
      }

      // Get product by ID
      if (path.match(/^\/products\/\d+$/) && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const product = await dbService.getProduct(id);
        if (!product) {
          return jsonResponse({ error: 'Product not found' }, corsHeaders, 404);
        }
        return jsonResponse(product, corsHeaders);
      }

      // Update product
      if (path.match(/^\/products\/\d+$/) && method === 'PUT') {
        const id = parseInt(path.split('/')[2]);
        const body = await request.json() as any;
        await dbService.updateProduct(
          id,
          body.name || '',
          body.description || '',
          body.category || ''
        );
        return jsonResponse({ success: true, message: 'Product updated' }, corsHeaders);
      }

      // Delete product
      if (path.match(/^\/products\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/')[2]);
        try {
          await dbService.deleteProduct(id);
          return jsonResponse({ success: true, message: 'Product deleted' }, corsHeaders);
        } catch (e) {
          // FRICTION: D1 foreign key errors are not descriptive
          return jsonResponse({
            error: 'Cannot delete product with existing feedback',
            details: String(e)
          }, corsHeaders, 400);
        }
      }

      // ============================================
      // FEEDBACK ENDPOINTS
      // ============================================

      // Get feedback for product
      if (path.match(/^\/products\/\d+\/feedback$/) && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const limit = parseInt(url.searchParams.get('limit') || '100');
        const feedback = await dbService.getFeedbackByProduct(id, limit);
        return jsonResponse(feedback, corsHeaders);
      }

      // Get Kanban view (feedback grouped by status)
      if (path.match(/^\/products\/\d+\/kanban$/) && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const kanban = await dbService.getFeedbackByStatus(id);
        return jsonResponse(kanban, corsHeaders);
      }

      // Get stats for product
      if (path.match(/^\/products\/\d+\/stats$/) && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const stats = await dbService.getFeedbackStats(id);
        return jsonResponse(stats, corsHeaders);
      }

      // Get analytics (pie chart data)
      if (path.match(/^\/products\/\d+\/analytics$/) && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const analytics = await dbService.getAnalytics(id);
        return jsonResponse(analytics, corsHeaders);
      }

      // Global analytics
      if (path === '/analytics' && method === 'GET') {
        const analytics = await dbService.getAnalytics();
        return jsonResponse(analytics, corsHeaders);
      }

      // Search feedback
      if (path.match(/^\/products\/\d+\/search$/) && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const query = url.searchParams.get('q');
        if (!query) {
          return jsonResponse({ error: 'Query parameter "q" required' }, corsHeaders, 400);
        }
        const results = await dbService.searchFeedback(id, query);
        return jsonResponse(results, corsHeaders);
      }

      // Semantic search
      if (path.match(/^\/products\/\d+\/semantic-search$/) && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const query = url.searchParams.get('q');
        if (!query) {
          return jsonResponse({ error: 'Query parameter "q" required' }, corsHeaders, 400);
        }
        const results = await vectorService.searchSimilar(query, id, 10);
        const feedbackData = [];
        for (const r of results) {
          const fb = await dbService.getFeedback(r.feedbackId);
          if (fb) {
            feedbackData.push({ ...fb, similarity_score: r.score });
          }
        }
        return jsonResponse(feedbackData, corsHeaders);
      }

      // Create feedback manually
      if (path === '/feedback' && method === 'POST') {
        const data = await request.json() as CreateFeedbackRequest;

        if (!data.product_id || !data.source_name || !data.content) {
          return jsonResponse(
            { error: 'Missing required fields: product_id, source_name, content' },
            corsHeaders,
            400
          );
        }

        // Ensure source exists
        await dbService.getOrCreateSource(data.source_name, 'manual');

        const feedbackId = await dbService.createFeedback(data);

        // Only trigger workflow if AI processing is needed (no manual classification)
        const needsAIProcessing = !data.priority || !data.category;
        let workflowId = null;

        if (needsAIProcessing) {
          const workflowInstance = await env.FEEDBACK_WORKFLOW.create({
            id: `feedback-${feedbackId}-${Date.now()}`,
            params: { feedbackId }
          });
          workflowId = workflowInstance.id;
        }

        return jsonResponse({
          success: true,
          feedback_id: feedbackId,
          workflow_id: workflowId,
          message: needsAIProcessing
            ? 'Feedback created and processing started'
            : 'Feedback created with manual classification'
        }, corsHeaders, 201);
      }

      // Get specific feedback
      if (path.match(/^\/feedback\/\d+$/) && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const feedback = await dbService.getFeedback(id);
        if (!feedback) {
          return jsonResponse({ error: 'Feedback not found' }, corsHeaders, 404);
        }
        return jsonResponse(feedback, corsHeaders);
      }

      // Update feedback
      if (path.match(/^\/feedback\/\d+$/) && method === 'PUT') {
        const id = parseInt(path.split('/')[2]);
        const body = await request.json() as any;
        await dbService.updateFeedback(id, body);
        return jsonResponse({ success: true, message: 'Feedback updated' }, corsHeaders);
      }

      // Update feedback status (for Kanban)
      if (path.match(/^\/feedback\/\d+\/status$/) && method === 'PATCH') {
        const id = parseInt(path.split('/')[2]);
        const body = await request.json() as any;
        if (!body.status) {
          return jsonResponse({ error: 'Status is required' }, corsHeaders, 400);
        }
        await dbService.updateFeedbackStatus(id, body.status);
        return jsonResponse({ success: true, message: 'Status updated' }, corsHeaders);
      }

      // Delete feedback
      if (path.match(/^\/feedback\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/')[2]);
        await dbService.deleteFeedback(id);
        return jsonResponse({ success: true, message: 'Feedback deleted' }, corsHeaders);
      }

      // Find similar feedback
      if (path.match(/^\/feedback\/\d+\/similar$/) && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const similar = await vectorService.findSimilar(id, 5);
        const feedbackData = [];
        for (const s of similar) {
          const fb = await dbService.getFeedback(s.feedbackId);
          if (fb) {
            feedbackData.push({ ...fb, similarity_score: s.score });
          }
        }
        return jsonResponse(feedbackData, corsHeaders);
      }

      // ============================================
      // WEBHOOK ENDPOINTS
      // ============================================

      // Receive webhook from external source
      if (path.match(/^\/webhooks\/(discord|slack|github|twitter|x|email)$/) && method === 'POST') {
        const source = path.split('/')[2];
        const payload = await request.json();

        // Parse webhook using AI-powered parser
        const parsed = await webhookParser.parse(source, payload);

        // Determine product (use hint or default to first product)
        let productId = 1;
        if (parsed.product_hint) {
          const products = await dbService.getProducts();
          const match = products.find(p =>
            p.name.toLowerCase().includes(parsed.product_hint!.toLowerCase())
          );
          if (match) productId = match.id;
        }

        // Ensure source exists
        const sourceType = source === 'email' ? 'email' :
                          source === 'github' ? 'code_repository' :
                          source === 'discord' || source === 'slack' ? 'chat' : 'social';
        await dbService.getOrCreateSource(source, sourceType);

        // Create feedback
        const feedbackId = await dbService.createFeedback({
          product_id: productId,
          source_name: source,
          title: parsed.title || undefined,
          content: parsed.content,
          author_name: parsed.author_name || undefined,
          author_email: parsed.author_email || undefined,
          external_id: parsed.external_id || undefined,
          url: parsed.url || undefined,
          raw_data: parsed.raw_data
        });

        // Trigger workflow
        const workflowInstance = await env.FEEDBACK_WORKFLOW.create({
          id: `webhook-${source}-${feedbackId}-${Date.now()}`,
          params: { feedbackId }
        });

        return jsonResponse({
          success: true,
          source,
          feedback_id: feedbackId,
          workflow_id: workflowInstance.id,
          message: `Webhook from ${source} processed`
        }, corsHeaders, 201);
      }

      // Generate mock webhook (for testing)
      if (path.match(/^\/webhooks\/test\/(discord|slack|github|twitter|email)$/) && method === 'POST') {
        const source = path.split('/')[3] as keyof typeof mockWebhooks;
        const mockPayload = mockWebhooks[source]();

        // Parse and process like a real webhook
        const parsed = await webhookParser.parse(source, mockPayload);

        let productId = 1;
        const products = await dbService.getProducts();
        if (products.length > 0) {
          productId = products[Math.floor(Math.random() * products.length)].id;
        }

        await dbService.getOrCreateSource(source, 'test');

        const feedbackId = await dbService.createFeedback({
          product_id: productId,
          source_name: source,
          title: parsed.title || undefined,
          content: parsed.content,
          author_name: parsed.author_name || undefined,
          author_email: parsed.author_email || undefined,
          external_id: parsed.external_id || undefined,
          url: parsed.url || undefined,
          raw_data: parsed.raw_data
        });

        const workflowInstance = await env.FEEDBACK_WORKFLOW.create({
          id: `test-${source}-${feedbackId}-${Date.now()}`,
          params: { feedbackId }
        });

        return jsonResponse({
          success: true,
          source,
          mock_payload: mockPayload,
          parsed: parsed,
          feedback_id: feedbackId,
          workflow_id: workflowInstance.id
        }, corsHeaders, 201);
      }

      // ============================================
      // OTHER ENDPOINTS
      // ============================================

      // Get sources
      if (path === '/sources' && method === 'GET') {
        const sources = await dbService.getFeedbackSources();
        return jsonResponse(sources, corsHeaders);
      }

      // Workflow status
      if (path.match(/^\/workflow\/[\w-]+$/) && method === 'GET') {
        const workflowId = path.split('/')[2];
        try {
          const instance = await env.FEEDBACK_WORKFLOW.get(workflowId);
          const status = await instance.status();
          return jsonResponse({ workflow_id: workflowId, ...status }, corsHeaders);
        } catch (error) {
          return jsonResponse({ error: 'Workflow not found' }, corsHeaders, 404);
        }
      }

      // Load mock data
      if (path === '/load-mock-data' && method === 'POST') {
        const results = [];
        for (const mockFeedback of mockFeedbackData) {
          try {
            const feedbackId = await dbService.createFeedback(mockFeedback);
            const workflowInstance = await env.FEEDBACK_WORKFLOW.create({
              id: `mock-${feedbackId}-${Date.now()}`,
              params: { feedbackId }
            });
            results.push({ success: true, feedback_id: feedbackId, workflow_id: workflowInstance.id });
          } catch (error) {
            results.push({ success: false, error: String(error) });
          }
        }
        return jsonResponse({ message: 'Mock data loaded', count: results.length, results }, corsHeaders);
      }

      // 404
      return jsonResponse({ error: 'Endpoint not found', path, method }, corsHeaders, 404);

    } catch (error) {
      console.error('Error:', error);
      return jsonResponse({
        error: 'Internal server error',
        details: String(error)
      }, corsHeaders, 500);
    }
  }
};

function jsonResponse(data: any, headers: Record<string, string>, status: number = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}
