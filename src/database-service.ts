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

  // Feedback Source operations
  async getFeedbackSources(): Promise<FeedbackSource[]> {
    const result = await this.env.DB.prepare('SELECT * FROM feedback_sources WHERE is_active = 1').all();
    return result.results as FeedbackSource[];
  }

  async getFeedbackSourceByName(name: string): Promise<FeedbackSource | null> {
    const result = await this.env.DB.prepare('SELECT * FROM feedback_sources WHERE name = ?').bind(name).first();
    return result as FeedbackSource | null;
  }

  // Feedback operations
  async createFeedback(data: CreateFeedbackRequest): Promise<number> {
    // Get source ID
    const source = await this.getFeedbackSourceByName(data.source_name);
    if (!source) {
      throw new Error(`Feedback source '${data.source_name}' not found`);
    }

    const result = await this.env.DB.prepare(`
      INSERT INTO feedback (
        product_id, source_id, external_id, title, content,
        author_name, author_email, url, raw_data, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'unprocessed')
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
        data.raw_data ? JSON.stringify(data.raw_data) : null
      )
      .run();

    return result.meta.last_row_id;
  }

  async getFeedback(id: number): Promise<Feedback | null> {
    const result = await this.env.DB.prepare('SELECT * FROM feedback WHERE id = ?').bind(id).first();
    return result as Feedback | null;
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
        AVG(sentiment_score) as avg_sentiment
      FROM feedback
      WHERE status = 'processed'
    `;

    if (productId) {
      query += ' AND product_id = ?';
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
}
