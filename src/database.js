/**
 * Database Operations Module
 * Handles all D1 database interactions
 */

/**
 * Store processed feedback in D1
 */
export async function storeFeedback(db, feedback) {
	try {
		const result = await db.prepare(`
			INSERT INTO feedback (
				source, source_id, product, title, content, author, author_email,
				sentiment, sentiment_score, category, priority, status,
				ai_summary, created_at, processed_at, metadata
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`).bind(
			feedback.source,
			feedback.source_id,
			feedback.product,
			feedback.title || null,
			feedback.content,
			feedback.author || null,
			feedback.author_email || null,
			feedback.sentiment || 'neutral',
			feedback.sentiment_score || 0.5,
			feedback.category || 'other',
			feedback.priority || 'medium',
			feedback.status || 'new',
			feedback.ai_summary || null,
			feedback.created_at,
			feedback.processed_at || new Date().toISOString(),
			feedback.metadata || null
		).run();
		
		// Get the inserted ID from meta
		return result.meta.last_row_id;
	} catch (error) {
		console.error('Database insert error:', error);
		throw error;
	}
}

/**
 * Get feedback with filters
 */
export async function getFeedback(db, filters = {}) {
	try {
		let query = 'SELECT * FROM feedback WHERE 1=1';
		const bindings = [];
		
		if (filters.product) {
			query += ' AND product = ?';
			bindings.push(filters.product);
		}
		
		if (filters.source) {
			query += ' AND source = ?';
			bindings.push(filters.source);
		}
		
		if (filters.sentiment) {
			query += ' AND sentiment = ?';
			bindings.push(filters.sentiment);
		}
		
		if (filters.category) {
			query += ' AND category = ?';
			bindings.push(filters.category);
		}
		
		if (filters.priority) {
			query += ' AND priority = ?';
			bindings.push(filters.priority);
		}
		
		if (filters.status) {
			query += ' AND status = ?';
			bindings.push(filters.status);
		}
		
		query += ' ORDER BY created_at DESC';
		
		if (filters.limit) {
			query += ' LIMIT ?';
			bindings.push(filters.limit);
		}
		
		if (filters.offset) {
			query += ' OFFSET ?';
			bindings.push(filters.offset);
		}
		
		const result = await db.prepare(query).bind(...bindings).all();
		return result.results || [];
	} catch (error) {
		console.error('Database query error:', error);
		throw error;
	}
}

/**
 * Semantic search using Vectorize and D1
 */
export async function searchFeedback(ai, vectorize, db, query, limit = 10) {
	try {
		// Generate embedding for search query
		const queryEmbedding = await ai.run('@cf/baai/bge-base-en-v1.5', {
			text: query
		});
		
		if (!queryEmbedding || !queryEmbedding.data || !queryEmbedding.data[0]) {
			throw new Error('Failed to generate query embedding');
		}
		
		// Search Vectorize
		const matches = await vectorize.query(queryEmbedding.data[0], {
			topK: limit,
			returnMetadata: true
		});
		
		if (!matches || !matches.matches || matches.matches.length === 0) {
			return [];
		}
		
		// Get full feedback details from D1
		const ids = matches.matches.map(m => m.id);
		const placeholders = ids.map(() => '?').join(',');
		
		const result = await db.prepare(
			`SELECT * FROM feedback WHERE id IN (${placeholders})`
		).bind(...ids).all();
		
		// Combine with similarity scores
		const feedbackMap = new Map(
			(result.results || []).map(f => [f.id.toString(), f])
		);
		
		return matches.matches.map(match => ({
			...feedbackMap.get(match.id),
			similarity_score: match.score
		})).filter(item => item.id); // Filter out any missing items
	} catch (error) {
		console.error('Search error:', error);
		throw error;
	}
}

/**
 * Get analytics dashboard data
 */
export async function getAnalytics(db, filters = {}) {
	try {
		let whereClause = 'WHERE 1=1';
		const bindings = [];
		
		if (filters.product) {
			whereClause += ' AND product = ?';
			bindings.push(filters.product);
		}
		
		if (filters.startDate) {
			whereClause += ' AND created_at >= ?';
			bindings.push(filters.startDate);
		}
		
		if (filters.endDate) {
			whereClause += ' AND created_at <= ?';
			bindings.push(filters.endDate);
		}
		
		// Total counts
		const totalResult = await db.prepare(
			`SELECT COUNT(*) as total FROM feedback ${whereClause}`
		).bind(...bindings).first();
		
		// Sentiment breakdown
		const sentimentResult = await db.prepare(
			`SELECT sentiment, COUNT(*) as count 
			 FROM feedback ${whereClause}
			 GROUP BY sentiment`
		).bind(...bindings).all();
		
		// Category breakdown
		const categoryResult = await db.prepare(
			`SELECT category, COUNT(*) as count 
			 FROM feedback ${whereClause}
			 GROUP BY category
			 ORDER BY count DESC`
		).bind(...bindings).all();
		
		// Priority breakdown
		const priorityResult = await db.prepare(
			`SELECT priority, COUNT(*) as count 
			 FROM feedback ${whereClause}
			 GROUP BY priority`
		).bind(...bindings).all();
		
		// Source breakdown
		const sourceResult = await db.prepare(
			`SELECT source, COUNT(*) as count 
			 FROM feedback ${whereClause}
			 GROUP BY source
			 ORDER BY count DESC`
		).bind(...bindings).all();
		
		// Status breakdown
		const statusResult = await db.prepare(
			`SELECT status, COUNT(*) as count 
			 FROM feedback ${whereClause}
			 GROUP BY status`
		).bind(...bindings).all();
		
		// Trend data (last 30 days)
		const trendResult = await db.prepare(
			`SELECT 
				DATE(created_at) as date,
				COUNT(*) as count,
				AVG(sentiment_score) as avg_sentiment
			 FROM feedback ${whereClause}
			 GROUP BY DATE(created_at)
			 ORDER BY date DESC
			 LIMIT 30`
		).bind(...bindings).all();
		
		// Average sentiment score
		const avgSentimentResult = await db.prepare(
			`SELECT AVG(sentiment_score) as avg_score 
			 FROM feedback ${whereClause}`
		).bind(...bindings).first();
		
		// Top issues (negative feedback with high priority)
		const topIssuesResult = await db.prepare(
			`SELECT id, title, content, sentiment, priority, category, created_at
			 FROM feedback 
			 ${whereClause} AND sentiment = 'negative' AND priority IN ('high', 'critical')
			 ORDER BY 
				CASE priority 
					WHEN 'critical' THEN 1 
					WHEN 'high' THEN 2 
					ELSE 3 
				END,
				created_at DESC
			 LIMIT 10`
		).bind(...bindings).all();
		
		return {
			summary: {
				total: totalResult?.total || 0,
				average_sentiment: avgSentimentResult?.avg_score || 0.5
			},
			sentiment: sentimentResult?.results || [],
			categories: categoryResult?.results || [],
			priorities: priorityResult?.results || [],
			sources: sourceResult?.results || [],
			statuses: statusResult?.results || [],
			trend: trendResult?.results || [],
			top_issues: topIssuesResult?.results || []
		};
	} catch (error) {
		console.error('Analytics error:', error);
		throw error;
	}
}

/**
 * Store product information
 */
export async function storeProduct(db, product) {
	try {
		await db.prepare(`
			INSERT OR IGNORE INTO products (name, description, created_at)
			VALUES (?, ?, ?)
		`).bind(
			product.name,
			product.description || null,
			new Date().toISOString()
		).run();
	} catch (error) {
		console.error('Product insert error:', error);
		throw error;
	}
}

/**
 * Get all products
 */
export async function getProducts(db) {
	try {
		const result = await db.prepare(
			'SELECT * FROM products ORDER BY name'
		).all();
		
		return result.results || [];
	} catch (error) {
		console.error('Get products error:', error);
		throw error;
	}
}
