import { Env, Feedback, Product, FeedbackSource, FeedbackSummary, CreateFeedbackRequest } from './types';

export class DatabaseService {
  constructor(private env: Env) {}

  // Product operations
  async getProducts(): Promise<Product[]> {
    const result = await this.env.DB.prepare('SELECT * FROM products ORDER BY name').all();
    return result.results as Product[];
  }

  async getProduct(id: number): Promise<Product | null> {
    const result = await this.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
    return result as Product | null;
  }

  async createProduct(name: string, description: string, category: string): Promise<number> {
    const result = await this.env.DB.prepare(
      'INSERT INTO products (name, description, category) VALUES (?, ?, ?)'
    ).bind(name, description, category).run();
    return result.meta.last_row_id;
  }

  async updateProduct(id: number, name: string, description: string, category: string): Promise<void> {
    await this.env.DB.prepare(
      'UPDATE products SET name = ?, description = ?, category = ? WHERE id = ?'
    ).bind(name, description, category, id).run();
  }

  async deleteProduct(id: number): Promise<void> {
    // Note: This will fail if there's feedback referencing this product
    // FRICTION POINT: D1 doesn't have CASCADE DELETE by default, need manual handling
    await this.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
  }

  // Feedback Source operations
  async getFeedbackSources(): Promise<FeedbackSource[]> {
    const result = await this.env.DB.prepare('SELECT * FROM feedback_sources WHERE is_active = 1').all();
    return result.results as FeedbackSource[];
  }

  async getFeedbackSourceByName(name: string): Promise<FeedbackSource | null> {
    const result = await this.env.DB.prepare('SELECT * FROM feedback_sources WHERE name = ?').bind(name).first();
    return result as FeedbackSource | null;
  }

  async createFeedbackSource(name: string, sourceType: string): Promise<number> {
    const result = await this.env.DB.prepare(
      'INSERT INTO feedback_sources (name, source_type, is_active) VALUES (?, ?, 1)'
    ).bind(name, sourceType).run();
    return result.meta.last_row_id;
  }

  async getOrCreateSource(name: string, sourceType: string): Promise<FeedbackSource> {
    let source = await this.getFeedbackSourceByName(name);
    if (!source) {
      const id = await this.createFeedbackSource(name, sourceType);
      source = { id, name, source_type: sourceType, is_active: 1, created_at: new Date().toISOString() };
    }
    return source;
  }

  // Feedback operations
  async createFeedback(data: CreateFeedbackRequest): Promise<number> {
    // Get source ID
    const source = await this.getFeedbackSourceByName(data.source_name);
    if (!source) {
      throw new Error(`Feedback source '${data.source_name}' not found`);
    }

    // If priority and category are provided, mark as pre-processed
    const hasManualClassification = data.priority && data.category;
    const status = hasManualClassification ? 'processed' : 'unprocessed';

    // Determine feedback type: internal (slack, discord) vs external (customer-facing)
    const internalSources = ['slack', 'discord'];
    const feedbackType = data.feedback_type || (internalSources.includes(data.source_name) ? 'internal' : 'external');

    const result = await this.env.DB.prepare(`
      INSERT INTO feedback (
        product_id, source_id, external_id, title, content,
        author_name, author_email, url, raw_data, status,
        priority, category, feedback_type, processed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        data.product_id,
        source.id,
        data.external_id || null,
        data.title || null,
        data.content,
        data.author_name || null,
        data.author_email || null,
        data.url || null,
        data.raw_data ? JSON.stringify(data.raw_data) : null,
        status,
        data.priority || null,
        data.category || null,
        feedbackType,
        hasManualClassification ? new Date().toISOString() : null
      )
      .run();

    return result.meta.last_row_id;
  }

  async getFeedback(id: number): Promise<Feedback | null> {
    const result = await this.env.DB.prepare('SELECT * FROM feedback WHERE id = ?').bind(id).first();
    return result as Feedback | null;
  }

  async updateFeedback(id: number, updates: Partial<Feedback>): Promise<void> {
    // Build dynamic update query
    // FRICTION POINT: D1 doesn't have a nice way to do partial updates, need to build query manually
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
    if (updates.content !== undefined) { fields.push('content = ?'); values.push(updates.content); }
    if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
    if (updates.priority !== undefined) { fields.push('priority = ?'); values.push(updates.priority); }
    if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category); }

    if (fields.length === 0) return;

    values.push(id);
    await this.env.DB.prepare(
      `UPDATE feedback SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();
  }

  async updateFeedbackStatus(id: number, status: string): Promise<void> {
    await this.env.DB.prepare(
      'UPDATE feedback SET status = ? WHERE id = ?'
    ).bind(status, id).run();
  }

  async deleteFeedback(id: number): Promise<void> {
    await this.env.DB.prepare('DELETE FROM feedback WHERE id = ?').bind(id).run();
  }

  async getUnprocessedFeedback(limit: number = 10): Promise<Feedback[]> {
    const result = await this.env.DB.prepare(`
      SELECT * FROM feedback 
      WHERE status = 'unprocessed' 
      ORDER BY created_at DESC 
      LIMIT ?
    `).bind(limit).all();
    return result.results as Feedback[];
  }

  async updateFeedbackAnalysis(
    id: number,
    sentimentScore: number,
    sentimentLabel: string,
    category: string,
    priority: string
  ): Promise<void> {
    await this.env.DB.prepare(`
      UPDATE feedback 
      SET sentiment_score = ?,
          sentiment_label = ?,
          category = ?,
          priority = ?,
          status = 'processed',
          processed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(sentimentScore, sentimentLabel, category, priority, id)
      .run();
  }

  async getFeedbackByProduct(productId: number, limit: number = 50): Promise<Feedback[]> {
    const result = await this.env.DB.prepare(`
      SELECT * FROM feedback 
      WHERE product_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `).bind(productId, limit).all();
    return result.results as Feedback[];
  }

  async getFeedbackStats(productId?: number): Promise<any> {
    // Count ALL feedback, not just processed
    let query = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN sentiment_label = 'positive' THEN 1 ELSE 0 END) as positive,
        SUM(CASE WHEN sentiment_label = 'negative' THEN 1 ELSE 0 END) as negative,
        SUM(CASE WHEN sentiment_label = 'neutral' THEN 1 ELSE 0 END) as neutral,
        SUM(CASE WHEN category = 'bug' THEN 1 ELSE 0 END) as bugs,
        SUM(CASE WHEN category = 'feature_request' THEN 1 ELSE 0 END) as features,
        SUM(CASE WHEN priority = 'critical' THEN 1 ELSE 0 END) as critical,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high,
        SUM(CASE WHEN status = 'unprocessed' THEN 1 ELSE 0 END) as pending,
        AVG(sentiment_score) as avg_sentiment
      FROM feedback
    `;

    if (productId) {
      query += ' WHERE product_id = ?';
      const result = await this.env.DB.prepare(query).bind(productId).first();
      return result;
    } else {
      const result = await this.env.DB.prepare(query).first();
      return result;
    }
  }

  async searchFeedback(productId: number, query: string): Promise<Feedback[]> {
    const result = await this.env.DB.prepare(`
      SELECT * FROM feedback 
      WHERE product_id = ? 
      AND (title LIKE ? OR content LIKE ?)
      ORDER BY created_at DESC 
      LIMIT 20
    `).bind(productId, `%${query}%`, `%${query}%`).all();
    return result.results as Feedback[];
  }

  // Summary operations
  async createSummary(
    productId: number,
    startDate: string,
    endDate: string,
    summary: string,
    themes: string[],
    sentimentBreakdown: any,
    categoryBreakdown: any,
    count: number
  ): Promise<number> {
    const result = await this.env.DB.prepare(`
      INSERT INTO feedback_summaries (
        product_id, date_range_start, date_range_end, summary,
        key_themes, sentiment_breakdown, category_breakdown, total_feedback_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        productId,
        startDate,
        endDate,
        summary,
        JSON.stringify(themes),
        JSON.stringify(sentimentBreakdown),
        JSON.stringify(categoryBreakdown),
        count
      )
      .run();

    return result.meta.last_row_id;
  }

  async getRecentSummaries(productId: number, limit: number = 5): Promise<FeedbackSummary[]> {
    const result = await this.env.DB.prepare(`
      SELECT * FROM feedback_summaries
      WHERE product_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).bind(productId, limit).all();
    return result.results as FeedbackSummary[];
  }

  // Analytics for pie charts
  async getAnalytics(productId?: number): Promise<any> {
    const whereClause = productId ? 'WHERE product_id = ?' : '';
    const bindParams = productId ? [productId] : [];

    // Status distribution (for Kanban)
    const statusQuery = `
      SELECT status, COUNT(*) as count
      FROM feedback ${whereClause}
      GROUP BY status
    `;

    // Sentiment distribution
    const sentimentQuery = `
      SELECT sentiment_label, COUNT(*) as count
      FROM feedback ${whereClause} AND sentiment_label IS NOT NULL
      GROUP BY sentiment_label
    `;

    // Category distribution
    const categoryQuery = `
      SELECT category, COUNT(*) as count
      FROM feedback ${whereClause} AND category IS NOT NULL
      GROUP BY category
    `;

    // Priority distribution
    const priorityQuery = `
      SELECT priority, COUNT(*) as count
      FROM feedback ${whereClause} AND priority IS NOT NULL
      GROUP BY priority
    `;

    // Source distribution
    const sourceQuery = `
      SELECT fs.name as source, COUNT(*) as count
      FROM feedback f
      JOIN feedback_sources fs ON f.source_id = fs.id
      ${whereClause ? whereClause.replace('WHERE', 'WHERE f.') : ''}
      GROUP BY fs.name
    `;

    // FRICTION POINT: D1 doesn't support multiple statements in one call
    // Need to make 5 separate queries which is inefficient
    const [statusResult, sentimentResult, categoryResult, priorityResult, sourceResult] = await Promise.all([
      productId
        ? this.env.DB.prepare(statusQuery).bind(productId).all()
        : this.env.DB.prepare(statusQuery).all(),
      productId
        ? this.env.DB.prepare(sentimentQuery.replace('WHERE', 'WHERE product_id = ? AND')).bind(productId).all()
        : this.env.DB.prepare(sentimentQuery.replace(' AND', ' WHERE')).all(),
      productId
        ? this.env.DB.prepare(categoryQuery.replace('WHERE', 'WHERE product_id = ? AND')).bind(productId).all()
        : this.env.DB.prepare(categoryQuery.replace(' AND', ' WHERE')).all(),
      productId
        ? this.env.DB.prepare(priorityQuery.replace('WHERE', 'WHERE product_id = ? AND')).bind(productId).all()
        : this.env.DB.prepare(priorityQuery.replace(' AND', ' WHERE')).all(),
      productId
        ? this.env.DB.prepare(sourceQuery.replace('WHERE f.', 'WHERE f.product_id = ? AND f.')).bind(productId).all()
        : this.env.DB.prepare(sourceQuery).all(),
    ]);

    return {
      byStatus: statusResult.results,
      bySentiment: sentimentResult.results,
      byCategory: categoryResult.results,
      byPriority: priorityResult.results,
      bySource: sourceResult.results
    };
  }

  // Get feedback grouped by status for Kanban
  async getFeedbackByStatus(productId?: number): Promise<any> {
    const whereClause = productId ? 'WHERE product_id = ?' : '';

    const query = `
      SELECT * FROM feedback
      ${whereClause}
      ORDER BY
        CASE status
          WHEN 'new' THEN 1
          WHEN 'unprocessed' THEN 2
          WHEN 'reviewing' THEN 3
          WHEN 'planned' THEN 4
          WHEN 'in_development' THEN 5
          WHEN 'resolved' THEN 6
          WHEN 'closed' THEN 7
          ELSE 8
        END,
        created_at DESC
    `;

    const result = productId
      ? await this.env.DB.prepare(query).bind(productId).all()
      : await this.env.DB.prepare(query).all();

    // Group by status
    const grouped: Record<string, Feedback[]> = {
      todo: [],
      in_progress: [],
      done: []
    };

    for (const item of result.results as Feedback[]) {
      if (['new', 'unprocessed', 'processed'].includes(item.status)) {
        grouped.todo.push(item);
      } else if (['reviewing', 'planned', 'in_development'].includes(item.status)) {
        grouped.in_progress.push(item);
      } else {
        grouped.done.push(item);
      }
    }

    return grouped;
  }
}
