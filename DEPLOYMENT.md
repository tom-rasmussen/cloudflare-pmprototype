# Deployment Checklist

Follow these steps to deploy your Feedback Dashboard to Cloudflare.

## Prerequisites
- [ ] Cloudflare account created
- [ ] Wrangler CLI installed: `npm install -g wrangler`
- [ ] Node.js 16.17.0+ installed

## Step 1: Initial Setup

```bash
# Navigate to project directory
cd cloudflare-pmprototype

# Install dependencies
npm install

# Login to Cloudflare
wrangler login
```

## Step 2: Create D1 Database

```bash
# Create the database
wrangler d1 create feedback-db
```

**Important**: Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "feedback-db"
database_id = "YOUR_DATABASE_ID_HERE"  # ← Paste here
```

## Step 3: Initialize Database

```bash
# For local development
wrangler d1 execute feedback-db --local --file=./schema.sql

# For production (after deploying)
wrangler d1 execute feedback-db --remote --file=./schema.sql
```

## Step 4: Create Vectorize Index

```bash
# Create the vector index
wrangler vectorize create feedback-search --dimensions=768 --metric=cosine

# Configuration is already in wrangler.toml, no changes needed
```

## Step 5: Create Queue

```bash
# Create the processing queue
wrangler queues create feedback-processing-queue

# Configuration is already in wrangler.toml
```

## Step 6: Test Locally

```bash
# Start development server
npm run dev

# In another terminal, load mock data
curl -X POST http://localhost:8787/load-mock-data

# Check products
curl http://localhost:8787/products

# Open dashboard.html in your browser
open dashboard.html  # Mac
start dashboard.html # Windows
```

## Step 7: Deploy to Production

```bash
# Deploy the Worker
npm run deploy

# Initialize production database
wrangler d1 execute feedback-db --remote --file=./schema.sql
```

## Step 8: Load Mock Data

```bash
# Replace YOUR-WORKER-URL with your actual URL
curl -X POST https://feedback-dashboard.YOUR-ACCOUNT.workers.dev/load-mock-data
```

## Step 9: Test Production

```bash
# Test API
curl https://feedback-dashboard.YOUR-ACCOUNT.workers.dev/products

# Update dashboard.html API_BASE to your production URL
# Then access it via Workers Static Assets or upload to Pages
```

## Verification Checklist

After deployment, verify:

- [ ] Worker is accessible at your workers.dev URL
- [ ] GET `/products` returns 3 products
- [ ] POST `/load-mock-data` creates feedback
- [ ] Queue processing works (check logs with `wrangler tail`)
- [ ] AI analysis populates sentiment/category
- [ ] Vectorize indexing works (semantic search returns results)

## Troubleshooting

### Issue: "Database not found"
Solution: Make sure `database_id` in wrangler.toml matches your created database

### Issue: "Queue not found"
Solution: Recreate queue with `wrangler queues create feedback-processing-queue`

### Issue: "Vectorize index not found"
Solution: Check index name matches wrangler.toml (`feedback-search`)

### Issue: AI requests failing
Solution: Workers AI bindings require remote connection. Add `remote = true` if needed.

### Issue: Queue not processing
Solution: Check logs with `wrangler tail` to see queue consumer errors

## Production Considerations

Before going to production:

1. **Add Authentication**: Implement API authentication
2. **Rate Limiting**: Add rate limits to prevent abuse
3. **Error Handling**: Enhance error messages
4. **Monitoring**: Set up Cloudflare Analytics
5. **Custom Domain**: Configure custom domain in dashboard
6. **Database Backups**: Set up D1 backups
7. **Queue DLQ**: Monitor dead letter queue

## Useful Commands

```bash
# View logs
wrangler tail

# View D1 data
wrangler d1 execute feedback-db --remote --command "SELECT * FROM feedback LIMIT 5"

# Check queue status
wrangler queues consumer list feedback-processing-queue

# Update Worker
npm run deploy
```

## Next Steps

1. Build a proper frontend UI (React/Next.js)
2. Add real integration connectors (Zendesk, GitHub APIs)
3. Implement scheduled summaries (Cron Triggers)
4. Add user authentication and multi-tenancy
5. Create data export functionality

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [Vectorize Docs](https://developers.cloudflare.com/vectorize/)
- [Queues Docs](https://developers.cloudflare.com/queues/)
