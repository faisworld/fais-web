# Production Automated Article Generation Setup

This document explains how to set up the automated article generation system in production without requiring access to the admin panel.

## Architecture Overview

The system uses a secure architecture where:

- **Admin panel**: Only accessible on `localhost` for security
- **Automated scripts**: Run on production server using `INTERNAL_API_KEY` authentication
- **Cron jobs**: Execute via secure endpoints with proper authentication

## Environment Variables Required

### On Vercel (Production)

Set these environment variables in your Vercel dashboard:

```bash
# Required for OpenAI article generation
OPENAI_API_KEY=your_openai_api_key_here

# Required for Replicate image generation  
REPLICATE_API_TOKEN=your_replicate_token_here

# Required for Vercel Blob storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# Required for automated script authentication
INTERNAL_API_KEY=your_secure_internal_api_key_here

# Optional: Custom cron secret (defaults to the one in vercel.json)
CRON_SECRET=aQ7zL9kR3!xW1mP8*oN5bC2jH4fG0eD6uT9yI
```

## How It Works

### 1. Automated Article Generation Flow

```
Vercel Cron (every 2 days at 2 PM) 
  ↓
/api/cron/automated-article-generation 
  ↓
scripts/automated-article-generation.mjs 
  ↓
scripts/article-generator.mjs 
  ↓
/api/admin/ai-tools/generate-article (with INTERNAL_API_KEY)
  ↓
Article saved to content/ + blog-data.ts updated
```

### 2. Authentication System

- **Localhost access**: Admin panel available on `localhost:3000` (development only)
- **Internal API Key**: Production scripts authenticate using `Authorization: Bearer ${INTERNAL_API_KEY}`
- **Cron Secret**: Prevents unauthorized cron execution

### 3. Security Features

- Admin endpoints blocked on production domains
- Cron endpoints require secret parameter
- Internal API key validation for automated scripts
- All generated content properly sanitized and validated

## Deployment Checklist

### ✅ Environment Variables

- [ ] `OPENAI_API_KEY` set in Vercel
- [ ] `REPLICATE_API_TOKEN` set in Vercel  
- [ ] `BLOB_READ_WRITE_TOKEN` set in Vercel
- [ ] `INTERNAL_API_KEY` set in Vercel (generate a secure random string)

### ✅ Cron Configuration

- [ ] `vercel.json` updated with new cron endpoint
- [ ] Cron secret matches environment variable
- [ ] Schedule configured (currently: every 2 days at 2 PM)

### ✅ File Cleanup

- [ ] Old problematic cron endpoint disabled
- [ ] Malformed blog files removed
- [ ] `blog-data.ts` properly formatted

## Manual Testing

### Test Cron Endpoint (Production)

```bash
curl "https://fais.world/api/cron/automated-article-generation?cron_secret=aQ7zL9kR3!xW1mP8*oN5bC2jH4fG0eD6uT9yI"
```

### Test Article Generation API (Local Development)

```bash
# Start development server
npm run dev

# Test article generation
curl -X POST http://localhost:3000/api/admin/ai-tools/generate-article \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "Test AI Article", "keywords": ["AI", "test"], "wordCount": 500}'
```

### Test Automated Script (Local)

```bash
# Set environment variables
export INTERNAL_API_KEY="test-key-123"
export NODE_ENV="development"

# Run the automated script
node scripts/automated-article-generation.mjs
```

## Monitoring and Logs

### Vercel Function Logs

- View logs in Vercel dashboard under "Functions" tab
- Cron execution logs appear under the specific function runs

### Local Development Logs

- Check terminal output when running scripts
- Articles saved to `app/blog/content/`
- Updates applied to `app/blog/blog-data.ts`

## Troubleshooting

### Common Issues

1. **"Unauthorized" error in production**
   - Check `INTERNAL_API_KEY` is set in Vercel environment variables
   - Verify the key matches what the script is sending

2. **Cron job not running**
   - Verify `CRON_SECRET` matches between vercel.json and environment variables
   - Check Vercel cron execution logs

3. **Image generation failing**
   - Verify `REPLICATE_API_TOKEN` is valid
   - Check `BLOB_READ_WRITE_TOKEN` has write permissions

4. **Articles not appearing on site**
   - Check `blog-data.ts` was properly updated
   - Verify markdown files were created in `app/blog/content/`
   - Restart deployment to pick up new content

### Debug Steps

1. Test individual components:

   ```bash
   # Test article generation API
   curl -X POST localhost:3000/api/admin/ai-tools/generate-article -d '{"topic":"test"}'
   
   # Test image generation API  
   curl -X POST localhost:3000/api/admin/ai-tools/generate-media -d '{"mediaType":"image","prompt":"test"}'
   
   # Test automated script
   node scripts/automated-article-generation.mjs
   ```

2. Check environment variables:

   ```bash
   # In your deployment
   echo $INTERNAL_API_KEY
   echo $OPENAI_API_KEY
   echo $REPLICATE_API_TOKEN
   ```

## Security Notes

- Never commit API keys to version control
- Use strong, unique keys for `INTERNAL_API_KEY`
- Regularly rotate API keys
- Monitor API usage in respective dashboards
- Admin panel remains localhost-only for security

## Schedule Configuration

The current schedule runs every 2 days at 2 PM UTC:

```json
"schedule": "0 14 */2 * *"
```

To modify the schedule, update the cron expression in `vercel.json`:

- Daily: `"0 14 * * *"`
- Weekly: `"0 14 * * 1"`  
- Twice weekly: `"0 14 * * 1,4"`
