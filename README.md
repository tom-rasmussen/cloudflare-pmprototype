# PM Feedback Dashboard

A product manager's feedback aggregation and analysis dashboard built on Cloudflare Workers, D1, Workers AI, Vectorize, and Workflows.

## Features

- **Multi-Source Feedback Ingestion**: Webhooks for Discord, Slack, GitHub, Twitter/X, Email
- **AI-Powered Analysis**: Automatic sentiment analysis, categorization, and priority scoring
- **Semantic Search**: Find relevant feedback using natural language queries via Vectorize
- **Async Processing**: Workflow-based processing for scalable feedback analysis
- **Dashboard UI**: Kanban board, list view, filters, and ticket management
- **Internal/External Classification**: Distinguish team feedback (Slack/Discord) from customer feedback

## Architecture

```
┌─────────────────┐
│    Dashboard    │
│   (Browser UI)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                  Cloudflare Worker                       │
│                     (index.ts)                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   REST API  │  │   Dashboard  │  │    Webhooks    │  │
│  │  /products  │  │      /       │  │  /webhooks/*   │  │
│  │  /feedback  │  │              │  │                │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
└──────────┬──────────────┬───────────────────┬───────────┘
           │              │                   │
     ┌─────┴─────┐  ┌─────┴─────┐      ┌─────┴─────┐
     ▼           ▼  ▼           ▼      ▼           ▼
┌─────────┐ ┌─────────┐ ┌───────────┐ ┌─────────────────┐
│   D1    │ │ Workers │ │ Vectorize │ │    Workflow     │
│Database │ │   AI    │ │(Vector DB)│ │ (Async Process) │
│(SQLite) │ │         │ │           │ │                 │
└─────────┘ └─────────┘ └───────────┘ └─────────────────┘
```

## Cloudflare Services Used

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Workers** | API hosting, routing, dashboard serving | 100K requests/day |
| **D1** | SQLite database for feedback storage | 5GB, 5M reads/day |
| **Workers AI** | Sentiment analysis, categorization, embeddings | ~10K neurons/day |
| **Vectorize** | Vector database for semantic search | 5M dimensions |
| **Workflows** | Async processing pipeline (replaces Queues) | Included |

## Project Structure

```
src/
├── index.ts              # Main Worker entry point & API routes
├── types.ts              # TypeScript interfaces
├── database-service.ts   # D1 database operations (CRUD)
├── ai-service.ts         # Workers AI integration (Llama, BGE)
├── vector-service.ts     # Vectorize operations (embeddings, search)
├── webhook-parser.ts     # Webhook parsing (Discord, Slack, GitHub, etc.)
├── mock-data.ts          # Test data generator (60 tickets)
├── dashboard.ts          # Dashboard HTML/CSS/JS (served inline)
└── workflows/
    └── feedback-processor.ts  # Async processing workflow
```

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Dashboard UI |
| GET | `/products` | List all products |
| POST | `/products` | Create product |
| GET | `/products/:id` | Get product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/products/:id/feedback` | Get feedback for product |
| GET | `/products/:id/stats` | Get feedback statistics |
| GET | `/products/:id/search?q=` | Text search |
| GET | `/products/:id/semantic-search?q=` | AI semantic search |

### Feedback
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/feedback` | Submit feedback (triggers workflow) |
| GET | `/feedback/:id` | Get feedback item |
| PUT | `/feedback/:id` | Update feedback |
| DELETE | `/feedback/:id` | Delete feedback |
| PATCH | `/feedback/:id/status` | Update status only |
| GET | `/feedback/:id/similar` | Find similar feedback |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhooks/discord` | Receive Discord webhook |
| POST | `/webhooks/slack` | Receive Slack webhook |
| POST | `/webhooks/github` | Receive GitHub webhook |
| POST | `/webhooks/twitter` | Receive Twitter/X webhook |
| POST | `/webhooks/email` | Receive email webhook |

### Utility
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sources` | List feedback sources |
| POST | `/load-mock-data` | Load 60 test tickets |

## Dashboard Features

### Views
- **Kanban Board**: TODO / In Progress / Done columns
- **List View**: Sortable list of all feedback

### Filters
- **Source**: Filter by origin (GitHub, Slack, Discord, etc.)
- **Sentiment**: Positive / Negative / Neutral
- **Category**: Bug, Feature Request, UX Issue, Performance, etc.
- **Priority**: Critical / High / Medium / Low
- **Type**: Internal (team) / External (customers)

### Ticket Management
- Create tickets manually with priority/category
- Edit tickets after creation
- Move tickets between statuses
- Delete tickets
- AI-powered semantic search

## Feedback Processing Pipeline

```
1. Feedback Submitted (API or Webhook)
         │
         ▼
2. Stored in D1 (status: 'unprocessed')
         │
         ▼
3. Workflow Triggered
         │
         ├──► AI Analysis (Llama 3.1 8B)
         │    - Sentiment score (-1 to 1)
         │    - Category classification
         │    - Priority scoring
         │
         ├──► Embedding Generated (BGE Base)
         │    - 768-dimensional vector
         │
         └──► Indexed in Vectorize
                   │
                   ▼
4. Status Updated to 'processed'
```

## AI Models

| Model | ID | Purpose |
|-------|-----|---------|
| Llama 3.1 8B | `@cf/meta/llama-3.1-8b-instruct` | Sentiment, categorization, priority |
| BGE Base EN | `@cf/baai/bge-base-en-v1.5` | Text embeddings (768 dims) |

## Quick Start

```bash
# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create feedback-db
# Update wrangler.toml with the database_id

# Initialize schema
npm run db:init

# Create Vectorize index
wrangler vectorize create feedback-search --dimensions=768 --metric=cosine

# Deploy
npm run deploy

# Load test data
curl -X POST https://your-worker.workers.dev/load-mock-data
```

## Local Development

```bash
npm run dev
```

**Note**: Workers AI and Vectorize require remote connections even in local dev. They will incur usage charges.

## Database Schema

### Tables
- **products**: Product catalog (id, name, description, category)
- **feedback_sources**: Source types (zendesk, github, slack, discord, etc.)
- **feedback**: All feedback with AI analysis results
- **feedback_summaries**: AI-generated periodic summaries

### Key Feedback Fields
| Field | Description |
|-------|-------------|
| `sentiment_score` | -1 (negative) to 1 (positive) |
| `sentiment_label` | positive / negative / neutral |
| `category` | bug, feature_request, ux_issue, performance, etc. |
| `priority` | critical / high / medium / low |
| `status` | new, unprocessed, processed, reviewing, planned, resolved, closed |
| `feedback_type` | internal (Slack/Discord) or external (customers) |

## Configuration

### wrangler.toml
```toml
name = "feedback-dashboard"
main = "src/index.ts"

[[d1_databases]]
binding = "DB"
database_name = "feedback-db"
database_id = "your-database-id"

[ai]
binding = "AI"

[[vectorize]]
binding = "VECTORIZE"
index_name = "feedback-search"

[[workflows]]
name = "feedback-processor"
binding = "FEEDBACK_WORKFLOW"
class_name = "FeedbackProcessorWorkflow"
```

## Why Workflows Instead of Queues?

Cloudflare Queues requires a paid plan ($5/month). Workflows is included in the free tier and provides:
- Durable execution with automatic retries
- Step-based processing with state persistence
- No charge for waiting/sleeping
- Auto-deploys with the Worker

## Webhook Integration

To connect real services, configure each platform to send webhooks to:
- Discord: `https://your-worker.workers.dev/webhooks/discord`
- Slack: `https://your-worker.workers.dev/webhooks/slack`
- GitHub: `https://your-worker.workers.dev/webhooks/github`

The webhook parser handles format detection with quick parsing for known formats and AI fallback for unknown formats.

**Production Note**: Add signature verification for Slack/GitHub webhooks before production use.
