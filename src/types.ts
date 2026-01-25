// Environment bindings
export interface Env {
  DB: D1Database;
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  FEEDBACK_QUEUE: Queue<FeedbackQueueMessage>;
}

// Database types
export interface Product {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  created_at: string;
}

export interface FeedbackSource {
  id: number;
  name: string;
  source_type: string;
  is_active: number;
  created_at: string;
}

export interface Feedback {
  id: number;
  product_id: number;
  source_id: number;
  external_id: string | null;
  title: string | null;
  content: string;
  author_name: string | null;
  author_email: string | null;
  url: string | null;
  sentiment_score: number | null;
  sentiment_label: string | null;
  category: string | null;
  priority: string | null;
  status: string;
  raw_data: string | null;
  created_at: string;
  processed_at: string | null;
}

export interface FeedbackSummary {
  id: number;
  product_id: number;
  date_range_start: string;
  date_range_end: string;
  summary: string;
  key_themes: string | null;
  sentiment_breakdown: string | null;
  category_breakdown: string | null;
  total_feedback_count: number | null;
  created_at: string;
}

// Queue message types
export interface FeedbackQueueMessage {
  feedbackId: number;
  action: 'process' | 'analyze' | 'embed';
}

// API types
export interface CreateFeedbackRequest {
  product_id: number;
  source_name: string;
  external_id?: string;
  title?: string;
  content: string;
  author_name?: string;
  author_email?: string;
  url?: string;
  raw_data?: Record<string, any>;
}

export interface AIAnalysisResult {
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  summary?: string;
}

// Vector search types
export interface VectorMetadata {
  feedbackId: number;
  productId: number;
  title?: string;
  snippet: string;
  category?: string;
  sentiment?: string;
}
