/**
 * Feedback Dashboard Worker
 * Aggregates feedback from multiple sources, processes with AI, and provides analytics
 */

import { Router } from 'itty-router';
import { generateMockFeedback } from './mockData';
import { processFeedbackWithAI, generateEmbedding } from './aiProcessing';
import { storeFeedback, getFeedback, searchFeedback, getAnalytics } from './database';
import { queueFeedback } from './queue';

const router = Router();

// CORS headers
const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight
router.options('*', () => new Response(null, { headers: corsHeaders }));

/**
 * Health check endpoint
 */
router.get('/', () => {
	return new Response(JSON.stringify({
		status: 'healthy',
		service: 'Feedback Dashboard API',
		version: '1.0.0',
		endpoints: {
			'POST /api/feedback': 'Submit new feedback',
			'GET /api/feedback': 'List all feedback (with filters)',
			'GET /api/feedback/:id': 'Get specific feedback',
			'POST /api/feedback/search': 'Semantic search',
			'GET /api/analytics': 'Get analytics dashboard data',
			'POST /api/mock/generate': 'Generate mock feedback data',
		}
	}), {
		headers: { ...corsHeaders, 'Content-Type': 'application/json' }
	});
});

/**
 * Generate and load mock feedback data
 */
router.post('/api/mock/generate', async (request, env) => {
	try {
		const { count = 20, product = 'CloudFlow Pro' } = await request.json().catch(() => ({}));
		
		const mockFeedback = generateMockFeedback(count, product);
		const results = [];
		
		for (const feedback of mockFeedback) {
			// Queue for async AI processing
			await queueFeedback(env.FEEDBACK_QUEUE, feedback);
			results.push({ id: feedback.source_id, status: 'queued' });
		}
		
		return new Response(JSON.stringify({
			success: true,
			message: `Generated and queued ${count} mock feedback items`,
			results
		}), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: error.message
		}), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
});

/**
 * Submit new feedback (webhook endpoint)
 */
router.post('/api/feedback', async (request, env) => {
	try {
		const feedback = await request.json();
		
		// Basic validation
		if (!feedback.content || !feedback.source || !feedback.product) {
			return new Response(JSON.stringify({
				error: 'Missing required fields: content, source, product'
			}), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}
		
		// Add timestamp
		feedback.created_at = new Date().toISOString();
		
		// Queue for async processing
		await queueFeedback(env.FEEDBACK_QUEUE, feedback);
		
		return new Response(JSON.stringify({
			success: true,
			message: 'Feedback queued for processing',
			id: feedback.source_id
		}), {
			status: 202,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: error.message
		}), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
});

/**
 * Get feedback list with filters
 */
router.get('/api/feedback', async (request, env) => {
	try {
		const url = new URL(request.url);
		const filters = {
			product: url.searchParams.get('product'),
			source: url.searchParams.get('source'),
			sentiment: url.searchParams.get('sentiment'),
			category: url.searchParams.get('category'),
			priority: url.searchParams.get('priority'),
			status: url.searchParams.get('status'),
			limit: parseInt(url.searchParams.get('limit') || '50'),
			offset: parseInt(url.searchParams.get('offset') || '0'),
		};
		
		const feedback = await getFeedback(env.DB, filters);
		
		return new Response(JSON.stringify({
			success: true,
			data: feedback,
			filters
		}), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: error.message
		}), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
});

/**
 * Get specific feedback by ID
 */
router.get('/api/feedback/:id', async (request, env) => {
	try {
		const { id } = request.params;
		const result = await env.DB.prepare(
			'SELECT * FROM feedback WHERE id = ?'
		).bind(id).first();
		
		if (!result) {
			return new Response(JSON.stringify({
				error: 'Feedback not found'
			}), {
				status: 404,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}
		
		return new Response(JSON.stringify({
			success: true,
			data: result
		}), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: error.message
		}), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
});

/**
 * Semantic search using Vectorize
 */
router.post('/api/feedback/search', async (request, env) => {
	try {
		const { query, limit = 10 } = await request.json();
		
		if (!query) {
			return new Response(JSON.stringify({
				error: 'Query parameter is required'
			}), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}
		
		const results = await searchFeedback(env.AI, env.VECTORIZE, env.DB, query, limit);
		
		return new Response(JSON.stringify({
			success: true,
			query,
			results
		}), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: error.message
		}), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
});

/**
 * Get analytics dashboard data
 */
router.get('/api/analytics', async (request, env) => {
	try {
		const url = new URL(request.url);
		const product = url.searchParams.get('product');
		const startDate = url.searchParams.get('start_date');
		const endDate = url.searchParams.get('end_date');
		
		const analytics = await getAnalytics(env.DB, { product, startDate, endDate });
		
		return new Response(JSON.stringify({
			success: true,
			data: analytics
		}), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: error.message
		}), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
});

/**
 * Queue consumer handler - processes feedback with AI
 */
export async function queue(batch, env) {
	for (const message of batch.messages) {
		try {
			const feedback = message.body;
			
			// Process with Workers AI
			const processed = await processFeedbackWithAI(env.AI, feedback);
			
			// Generate embedding for semantic search
			const embedding = await generateEmbedding(env.AI, feedback.content);
			
			// Store in D1
			const feedbackId = await storeFeedback(env.DB, processed);
			
			// Store embedding in Vectorize
			if (embedding && feedbackId) {
				await env.VECTORIZE.insert([{
					id: feedbackId.toString(),
					values: embedding,
					metadata: {
						product: feedback.product,
						source: feedback.source,
						category: processed.category,
						sentiment: processed.sentiment
					}
				}]);
			}
			
			// Acknowledge message
			message.ack();
		} catch (error) {
			console.error('Error processing feedback:', error);
			// Message will be retried or sent to DLQ
			message.retry();
		}
	}
}

/**
 * Main fetch handler
 */
export default {
	async fetch(request, env, ctx) {
		return router.handle(request, env, ctx).catch(err => {
			return new Response(JSON.stringify({
				error: 'Internal Server Error',
				message: err.message
			}), {
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		});
	},
	queue
};
