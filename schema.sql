-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Feedback sources table
CREATE TABLE IF NOT EXISTS feedback_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE, -- e.g., 'zendesk', 'github', 'twitter', 'email'
    source_type TEXT NOT NULL, -- 'support_ticket', 'social', 'community', 'email'
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    source_id INTEGER NOT NULL,
    external_id TEXT, -- ID from external system
    title TEXT,
    content TEXT NOT NULL,
    author_name TEXT,
    author_email TEXT,
    url TEXT,
    sentiment_score REAL, -- -1 to 1
    sentiment_label TEXT, -- 'positive', 'negative', 'neutral'
    category TEXT, -- 'bug', 'feature_request', 'ux_issue', 'performance', etc.
    priority TEXT, -- 'low', 'medium', 'high', 'critical'
    status TEXT DEFAULT 'unprocessed', -- 'unprocessed', 'processed', 'archived'
    raw_data TEXT, -- JSON blob for original data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (source_id) REFERENCES feedback_sources(id)
);

-- Summary insights table (AI-generated summaries)
CREATE TABLE IF NOT EXISTS feedback_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    date_range_start DATETIME NOT NULL,
    date_range_end DATETIME NOT NULL,
    summary TEXT NOT NULL, -- AI-generated summary
    key_themes TEXT, -- JSON array of themes
    sentiment_breakdown TEXT, -- JSON object with sentiment counts
    category_breakdown TEXT, -- JSON object with category counts
    total_feedback_count INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_product ON feedback(product_id);
CREATE INDEX IF NOT EXISTS idx_feedback_source ON feedback(source_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_sentiment ON feedback(sentiment_label);

-- Insert sample products for testing
INSERT INTO products (name, description, category) VALUES 
    ('CloudSync Pro', 'Cloud storage and file synchronization service', 'SaaS'),
    ('TaskFlow', 'Team collaboration and project management tool', 'Productivity'),
    ('DataViz Analytics', 'Business intelligence and data visualization platform', 'Analytics');

-- Insert feedback sources
INSERT INTO feedback_sources (name, source_type) VALUES 
    ('zendesk', 'support_ticket'),
    ('github', 'community'),
    ('twitter', 'social'),
    ('email', 'email'),
    ('intercom', 'support_ticket'),
    ('reddit', 'community');
