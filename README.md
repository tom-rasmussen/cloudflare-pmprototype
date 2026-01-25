# Feedback Dashboard Prototype

A product manager's feedback aggregation and analysis dashboard built on Cloudflare Workers, D1, Workers AI, Vectorize, and Queues.

## 🎯 Features

- **Multi-Source Feedback Ingestion**: Support for tickets, social media, GitHub, email, and more
- **AI-Powered Analysis**: Automatic sentiment analysis, categorization, and priority scoring using Workers AI
- **Semantic Search**: Find relevant feedback using natural language queries via Vectorize
- **Async Processing**: Queue-based processing for scalable feedback analysis
- **REST API**: Full-featured API for feedback management and insights

## 🏗️ Architecture

```
┌─────────────┐
│   Browser   │
│  /cURL/API  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Cloudflare      │
│ Worker (API)    │◄──────┐
└─────┬───────────┘       │
      │                   │
      ├───────────►┌──────┴────────┐
      │            │   D1 Database │
      │            │   (SQLite)    │
      │            └───────────────┘
      │
      ├───────────►┌───────────────┐
      │            │  Workers AI   │
      │            │ (Llama, BGE)  │
      │            └───────────────┘
      │
      ├───────────►┌───────────────┐
      │            │  Vectorize    │
      │            │ (Vector DB)   │
      │            └───────────────┘
      │
      └───────────►┌───────────────┐
                   │  Queue        │
                   │  (Consumer)   │
                   └───────────────┘
```

## 📋 Prerequisites

- Cloudflare account
- Node.js 16.17.0+ installed
- Wrangler CLI (`npm install -g wrangler`)

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
# Create the database
wrangler d1 create feedback-db

# Copy the database_id from the output and paste it into wrangler.toml
# Update the line: database_id = "your-database-id-here"
```

### 4. Initialize Database Schema

```bash
# Initialize locally for development
npm run db:init:local

# Initialize remote for production
npm run db:init
```

### 5. Create Vectorize Index

```bash
npm run vectorize:create

# This creates an index named "feedback-search" with 768 dimensions
# The configuration is already set in wrangler.toml
```

### 6. Create Queue

```bash
npm run queue:create

# Creates "feedback-processing-queue" for async processing
```

### 7. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

## 📡 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and available endpoints |
| GET | `/products` | List all products |
| GET | `/products/:id` | Get specific product |
| GET | `/products/:id/feedback` | Get feedback for a product |
| GET | `/products/:id/stats` | Get feedback statistics |
| GET | `/sources` | List feedback sources |

### Feedback Submission

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/feedback` | Submit new feedback (auto-queued for processing) |
| GET | `/feedback/:id` | Get specific feedback |
| GET | `/feedback/:id/similar` | Find similar feedback items |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products/:id/search?q=query` | Text-based search |
| GET | `/products/:id/semantic-search?q=query` | AI-powered semantic search |

### Testing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/load-mock-data` | Load 12 mock feedback items for testing |

## 🧪 Testing the API

### 1. Load Mock Data

```bash
curl -X POST http://localhost:8787/load-mock-data
```

This will create 12 feedback items across 3 products and queue them for AI processing.

### 2. Check Products

```bash
curl http://localhost:8787/products
```

### 3. View Feedback for a Product

```bash
# CloudSync Pro (product_id: 1)
curl http://localhost:8787/products/1/feedback

# TaskFlow (product_id: 2)
curl http://localhost:8787/products/2/feedback

# DataViz Analytics (product_id: 3)
curl http://localhost:8787/products/3/feedback
```

### 4. Get Statistics

```bash
curl http://localhost:8787/products/1/stats
```

### 5. Semantic Search

```bash
# Find feedback about sync issues
curl "http://localhost:8787/products/1/semantic-search?q=problems%20with%20syncing%20files"

# Find performance complaints
curl "http://localhost:8787/products/2/semantic-search?q=slow%20performance"
```

### 6. Submit New Feedback

```bash
curl -X POST http://localhost:8787/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "source_name": "email",
    "title": "Love the new UI",
    "content": "The redesigned interface is beautiful and much easier to navigate. Great job!",
    "author_name": "Happy User",
    "author_email": "user@example.com"
  }'
```

## 🔍 How It Works

### Feedback Processing Pipeline

1. **Submission**: Feedback is submitted via API
2. **Storage**: Stored in D1 database with status 'unprocessed'
3. **Queue**: Message sent to processing queue
4. **AI Analysis**: 
   - Sentiment analysis (-1 to 1 score)
   - Category classification (bug, feature_request, etc.)
   - Priority scoring (low, medium, high, critical)
5. **Embedding**: Text converted to 768-dimensional vector using BGE model
6. **Indexing**: Vector stored in Vectorize for semantic search
7. **Complete**: Status updated to 'processed'

### AI Models Used

- **Llama 3.1 8B Instruct** (`@cf/meta/llama-3.1-8b-instruct`): Sentiment and categorization
- **BGE Base EN v1.5** (`@cf/baai/bge-base-en-v1.5`): Text embeddings for semantic search

### Database Schema

- **products**: Product catalog
- **feedback_sources**: Source types (zendesk, github, twitter, etc.)
- **feedback**: All feedback with AI analysis results
- **feedback_summaries**: AI-generated summaries and insights

## 🎨 Example Use Cases

### For Product Managers

1. **Discover Themes**: "Show me all feedback about performance issues"
2. **Track Sentiment**: View sentiment trends over time per product
3. **Prioritize Issues**: See critical bugs and high-priority feature requests
4. **Find Patterns**: Semantic search to find related feedback across sources

### Example Queries

```bash
# Find all critical bugs
curl "http://localhost:8787/products/1/search?q=critical"

# Semantic search for UX issues
curl "http://localhost:8787/products/2/semantic-search?q=confusing%20user%20interface"

# Find similar feedback to a specific item
curl http://localhost:8787/feedback/1/similar
```

## 🚀 Deployment

```bash
npm run deploy
```

This will deploy to your `*.workers.dev` subdomain. You can also configure a custom domain in the Cloudflare dashboard.

## 📊 Data Model

### Products (Pre-populated)
- CloudSync Pro (id: 1) - Cloud storage service
- TaskFlow (id: 2) - Project management tool
- DataViz Analytics (id: 3) - BI platform

### Feedback Sources (Pre-populated)
- zendesk, github, twitter, email, intercom, reddit

### Mock Data Includes
- Bug reports
- Feature requests
- Performance complaints
- Positive reviews
- UX issues
- Pricing feedback
- Documentation issues

## 🔧 Development Tips

### Viewing Queue Processing

Queue processing happens automatically. Check Wrangler logs:

```bash
wrangler tail
```

### Testing Locally

All bindings work in local development:
- D1: Local SQLite database
- Vectorize: Requires remote connection (set `remote = true`)
- Workers AI: Requires remote connection (always remote)
- Queues: Local simulation

### Debugging

Enable verbose logging in `wrangler.toml`:
```toml
[observability]
enabled = true
head_sampling_rate = 1
```

## 🎯 Next Steps for Production

1. **Authentication**: Add API authentication
2. **Rate Limiting**: Implement rate limiting
3. **Webhooks**: Add webhook endpoints for real-time integrations
4. **Dashboard UI**: Build React/Next.js frontend
5. **Scheduled Jobs**: Add cron triggers for periodic summaries
6. **Real Integrations**: Connect to actual Zendesk, GitHub, etc.
7. **User Management**: Multi-tenant support

## 📝 Notes

- This is a prototype for testing Cloudflare's developer tools
- Mock data is AI-generated for demonstration
- Queue processing may take a few seconds
- First AI inference may be slower (cold start)

## 🤝 Feedback Welcome

This is a prototype to explore Cloudflare's PM tools. Feedback on the developer experience is valuable for improving Cloudflare's platform!
