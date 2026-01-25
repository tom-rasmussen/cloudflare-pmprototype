# Product Feedback Dashboard

A production-ready feedback aggregation and analysis platform built on Cloudflare's serverless stack. This tool helps product managers collect, analyze, and act on customer feedback from multiple sources using AI-powered sentiment analysis and semantic search.

## 🌟 Features

- **Multi-Source Aggregation**: Collect feedback from emails, support tickets, GitHub issues, social media, and forums
- **AI-Powered Analysis**: Automatic sentiment analysis, categorization, and priority scoring using Workers AI
- **Semantic Search**: Find relevant feedback using natural language queries powered by Vectorize
- **Async Processing**: Scalable queue-based processing for handling high volumes
- **Real-time Analytics**: Dashboard with sentiment trends, category breakdown, and priority insights
- **Mock Data Generator**: Built-in test data for prototyping and demos

## 🏗️ Architecture

```
┌─────────────┐
│   Sources   │ (Email, GitHub, Social, Tickets)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Worker    │ (API Endpoints)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Queue     │ (Async Processing)
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│ Workers AI  │────▶│   Vectorize  │ (Embeddings)
└──────┬──────┘     └──────────────┘
       │
       ▼
┌─────────────┐
│     D1      │ (Feedback Storage)
└─────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Wrangler CLI: `npm install -g wrangler`
- Cloudflare account with Workers Paid plan (for AI, Vectorize, and Queues)

### 1. Clone and Install

```bash
cd ~/Downloads/cloudflare-pmprototype
npm install
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

### 3. Create Resources

```bash
# Create D1 database
wrangler d1 create feedback_db

# Create Vectorize index
wrangler vectorize create feedback_embeddings --dimensions=768 --metric=cosine

# Create queue
wrangler queues create feedback-processing-queue
```

### 4. Update wrangler.toml

After creating resources, update the IDs in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "feedback_db"
database_id = "YOUR_DATABASE_ID_HERE"  # From step 3
```

### 5. Run Database Migrations

```bash
# For local development
wrangler d1 execute feedback_db --local --file=./schema.sql

# For production
wrangler d1 execute feedback_db --remote --file=./schema.sql
```

### 6. Start Development Server

```bash
wrangler dev
```

Visit `http://localhost:8787` to see the dashboard!

### 7. Deploy to Production

```bash
wrangler deploy
```

## 📡 API Endpoints

### Health Check
```
GET /
```

### Generate Mock Data
```
POST /api/mock/generate
Content-Type: application/json

{
  "count": 20,
  "product": "CloudFlow Pro"
}
```

### Submit Feedback
```
POST /api/feedback
Content-Type: application/json

{
  "source": "email",
  "source_id": "unique_id",
  "product": "CloudFlow Pro",
  "title": "Feature request",
  "content": "Would love to see dark mode...",
  "author": "John Doe",
  "author_email": "john@example.com"
}
```

### List Feedback
```
GET /api/feedback?product=CloudFlow+Pro&sentiment=negative&limit=50
```

Query parameters:
- `product` - Filter by product name
- `source` - Filter by source (email, github, etc.)
- `sentiment` - Filter by sentiment (positive, negative, neutral)
- `category` - Filter by category
- `priority` - Filter by priority
- `status` - Filter by status
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset

### Get Single Feedback
```
GET /api/feedback/:id
```

### Semantic Search
```
POST /api/feedback/search
Content-Type: application/json

{
  "query": "performance issues with loading",
  "limit": 10
}
```

### Get Analytics
```
GET /api/analytics?product=CloudFlow+Pro&start_date=2024-01-01&end_date=2024-12-31
```

## 🔧 Configuration

### Environment Variables (wrangler.toml)

- **D1 Database**: Stores all feedback and metadata
- **Vectorize**: Stores embeddings for semantic search
- **Workers AI**: Processes feedback for sentiment, categorization, and embeddings
- **Queue**: Handles async processing of feedback items

### Queue Configuration

```toml
[[queues.consumers]]
queue = "feedback-processing-queue"
max_batch_size = 10        # Process up to 10 items at once
max_batch_timeout = 30     # Wait up to 30s to fill batch
max_retries = 3            # Retry failed items 3 times
```

## 🧪 Testing the Dashboard

1. **Generate Mock Data**: Click "Generate Mock Data" button to create 20 test feedback items
2. **Wait for Processing**: Queue processes items asynchronously (10-30 seconds)
3. **Refresh Dashboard**: Click "Refresh" to see processed feedback
4. **Test Semantic Search**: Try queries like "bugs", "slow performance", "feature requests"
5. **Filter by Product**: Use the product dropdown to filter results

## 🎯 Use Cases

### For Product Managers
- Identify trending issues across products
- Track sentiment over time
- Prioritize feature requests based on demand
- Spot critical bugs from multiple channels

### For Support Teams
- Find related issues quickly with semantic search
- Track ticket sentiment trends
- Identify recurring problems

### For Engineering Teams
- Get aggregated bug reports
- Understand feature request context
- Track performance complaints

## 🔌 Integration Examples

### Email Webhook (SendGrid)
```javascript
// Configure SendGrid to POST to your worker
POST /api/feedback
{
  "source": "email",
  "source_id": "msg_123",
  "product": "CloudFlow Pro",
  "content": email.body,
  "author": email.from.name,
  "author_email": email.from.email
}
```

### GitHub Issues
```javascript
// GitHub webhook handler
if (webhook.action === 'opened' && webhook.issue) {
  await fetch('https://your-worker.workers.dev/api/feedback', {
    method: 'POST',
    body: JSON.stringify({
      source: 'github',
      source_id: `issue_${webhook.issue.number}`,
      product: 'CloudFlow Pro',
      title: webhook.issue.title,
      content: webhook.issue.body,
      author: webhook.issue.user.login,
      metadata: JSON.stringify({
        repo: webhook.repository.full_name,
        issue_number: webhook.issue.number,
        labels: webhook.issue.labels
      })
    })
  });
}
```

### Zendesk Integration
```javascript
// Zendesk webhook
POST /api/feedback
{
  "source": "support_ticket",
  "source_id": "ticket_12345",
  "product": "CloudFlow Pro",
  "title": ticket.subject,
  "content": ticket.description,
  "author": ticket.requester.name,
  "author_email": ticket.requester.email,
  "metadata": JSON.stringify({
    ticket_id: ticket.id,
    priority: ticket.priority,
    tags: ticket.tags
  })
}
```

## 🧠 AI Models Used

### Sentiment Analysis & Categorization
- Model: `@cf/meta/llama-3.1-8b-instruct`
- Analyzes feedback for sentiment, category, priority
- Generates concise summaries

### Embeddings for Semantic Search
- Model: `@cf/baai/bge-base-en-v1.5`
- Generates 768-dimensional embeddings
- Enables natural language search

## 📊 Database Schema

### Feedback Table
- `id` - Auto-increment primary key
- `source` - Origin (email, github, social, etc.)
- `product` - Product name
- `title` - Feedback title
- `content` - Full feedback text
- `sentiment` - positive/negative/neutral
- `sentiment_score` - 0-1 score
- `category` - bug/feature_request/ux_issue/performance/etc.
- `priority` - low/medium/high/critical
- `status` - new/reviewing/planned/resolved/closed
- `ai_summary` - AI-generated summary
- `created_at` - Submission timestamp
- `processed_at` - Processing timestamp

## 🚦 Rate Limits & Costs

### Cloudflare Workers Paid Plan Limits
- Workers AI: 10,000 neurons/day included
- Vectorize: 30M queried vectors/month included
- D1: 25 GB storage included
- Queues: 1M operations/month included

### Estimated Costs (per 1,000 feedback items)
- Workers AI: ~$0.50 (sentiment + embeddings)
- Vectorize: ~$0.01 (storage + queries)
- D1: ~$0.00 (well within free tier)
- Queue: ~$0.00 (well within free tier)

## 🔐 Security Considerations

- Add API authentication for production webhooks
- Validate webhook signatures (SendGrid, GitHub, etc.)
- Rate limit API endpoints
- Sanitize user input before storage
- Use Cloudflare Access for dashboard authentication

## 📈 Scaling Tips

1. **High Volume**: Increase queue batch size and timeout
2. **Large Products**: Add pagination to all endpoints
3. **Analytics**: Cache analytics results in KV namespace
4. **Search**: Pre-generate common search embeddings
5. **Multi-Region**: Deploy Workers globally for low latency

## 🐛 Troubleshooting

### Queue items not processing
- Check queue consumer is configured in wrangler.toml
- Verify Workers AI binding is correct
- Check logs: `wrangler tail`

### Vectorize errors
- Ensure dimensions match (768 for bge-base)
- Verify index was created with correct settings
- Check embedding generation isn't failing

### D1 query errors
- Run migrations: `wrangler d1 execute feedback_db --file=./schema.sql`
- Check database ID in wrangler.toml
- Verify SQL syntax compatibility

## 🤝 Contributing

This is a prototype for learning and testing Cloudflare's AI capabilities. Feel free to:
- Add new data sources
- Improve AI prompts
- Enhance the dashboard UI
- Add more analytics views

## 📝 License

MIT

## 🔗 Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Vectorize Documentation](https://developers.cloudflare.com/vectorize/)
- [D1 Database Documentation](https://developers.cloudflare.com/d1/)
- [Queues Documentation](https://developers.cloudflare.com/queues/)

---

Built with ❤️ using Cloudflare's AI-powered edge platform
