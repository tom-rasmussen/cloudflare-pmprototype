# Quick Setup Guide

## Step-by-Step Setup (5 minutes)

### 1. Install Dependencies
```bash
cd ~/Downloads/cloudflare-pmprototype
npm install
```

### 2. Login to Cloudflare
```bash
wrangler login
```
This will open a browser window. Authenticate with your Cloudflare account.

### 3. Create D1 Database
```bash
wrangler d1 create feedback_db
```

**IMPORTANT**: Copy the `database_id` from the output and paste it into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "feedback_db"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"  # ← Update this!
```

### 4. Create Vectorize Index
```bash
wrangler vectorize create feedback_embeddings --dimensions=768 --metric=cosine
```

### 5. Create Queue
```bash
wrangler queues create feedback-processing-queue
```

### 6. Run Database Migrations

For local development:
```bash
wrangler d1 execute feedback_db --local --file=./schema.sql
```

For production:
```bash
wrangler d1 execute feedback_db --remote --file=./schema.sql
```

### 7. Test Locally
```bash
wrangler dev
```

Open `http://localhost:8787` in your browser.

### 8. Deploy to Production
```bash
wrangler deploy
```

Your dashboard will be live at: `https://feedback-dashboard.YOUR_SUBDOMAIN.workers.dev`

## Quick Test

1. Open the dashboard
2. Click "Generate Mock Data" button
3. Wait 10-30 seconds for queue to process
4. Click "Refresh" button
5. See your feedback with AI analysis!

## Test Semantic Search

Try these queries:
- "performance issues"
- "bugs with the mobile app"
- "feature requests for dark mode"
- "slow loading times"

## Common Issues

### "Module not found: itty-router"
```bash
npm install itty-router
```

### "Database not found"
Make sure you updated the `database_id` in `wrangler.toml` after creating the database.

### "Queue not processing"
Wait 10-30 seconds. Queues batch items for efficiency. Check logs:
```bash
wrangler tail
```

### "Workers AI errors"
Make sure you're on a Workers Paid plan. Workers AI requires the paid plan.

## Next Steps

1. **Add Real Data Sources**: Integrate with your actual feedback channels
2. **Customize Categories**: Update AI prompts in `src/aiProcessing.js`
3. **Enhance Dashboard**: Modify `public/index.html` for your needs
4. **Add Authentication**: Implement Cloudflare Access for production
5. **Set Up Webhooks**: Configure your tools to POST to `/api/feedback`

## Need Help?

- Check the main README.md for detailed documentation
- Review Cloudflare docs: https://developers.cloudflare.com/
- Check logs: `wrangler tail --format pretty`

## Cloudflare Docs MCP Connection

The Cloudflare Docs MCP server is already connected in Claude Code! Use it to ask:
- "How do I optimize D1 queries?"
- "What are best practices for Workers AI?"
- "How can I secure my Worker endpoints?"

Happy building! 🚀
