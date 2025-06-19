# Automated Article Generation System - Production Setup

This guide explains how to set up the automated article generation system for production deployment on fais.world.

## Overview

The automated article generation system runs daily at 2:00 PM via a cron job and automatically:
1. Generates 1-2 high-quality AI articles on tech topics
2. Creates appropriate images for each article
3. Saves articles to the blog data system
4. Updates the RAG knowledge base with new content

## Production Setup Steps

### 1. Environment Variables

Add these environment variables to your production environment:

```bash
# Required for automated article generation
INTERNAL_API_KEY=your_secure_random_api_key_here
NODE_ENV=production

# Optional: Override default API endpoint
INTERNAL_API_BASE_URL=https://fais.world

# Required: OpenAI API key for article generation
OPENAI_API_KEY=your_openai_api_key
```

### 2. Generate Secure API Key

Generate a secure internal API key:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Using UUID
uuidgen
```

### 3. Set Up Cron Job

Run the setup script on your production server:

```bash
cd /path/to/your/fais-web
chmod +x scripts/setup-article-cron.sh
./scripts/setup-article-cron.sh
```

Then edit the cron job to add your actual API key:

```bash
crontab -e
```

Replace `your_secret_internal_api_key_here` with your actual generated key.

### 4. Verify Setup

Test the system manually:

```bash
cd /path/to/your/fais-web
NODE_ENV=production INTERNAL_API_KEY=your_actual_key node scripts/automated-article-generation.mjs
```

### 5. Monitor Logs

Check the generation logs:

```bash
tail -f /path/to/your/fais-web/logs/article-generation.log
```

## How It Works

### Authentication Flow

1. **Development**: System works on any localhost port without authentication
2. **Production**: System requires `INTERNAL_API_KEY` in Authorization header
3. **Automated Scripts**: Use internal API key to bypass localhost restriction

### API Endpoints

The system uses these internal API endpoints:

- `POST /api/admin/ai-tools/generate-article` - Generates article content and images
- `POST /api/admin/ai-tools/save-article` - Saves article to blog system

### Security Features

- Internal API key authentication for production automated access
- Host-based restriction (localhost only) for manual admin access
- Production domain blocks direct admin panel access
- Secure token-based authentication for automated scripts

## Troubleshooting

### Common Issues

1. **"Unauthorized" errors**
   - Verify `INTERNAL_API_KEY` is set correctly
   - Check that the key matches in both environment and cron job

2. **"Access Denied" errors**
   - Ensure cron job includes `NODE_ENV=production`
   - Verify the script is making requests to correct domain

3. **Articles not appearing**
   - Check logs in `/logs/article-generation.log`
   - Verify OpenAI API key is valid and has credits
   - Ensure blog-data.ts file is writable

4. **Cron job not running**
   - Check cron service is running: `sudo systemctl status cron`
   - Verify cron job exists: `crontab -l`
   - Check system logs: `grep CRON /var/log/syslog`

### Manual Testing

Test individual components:

```bash
# Test article generation
curl -X POST https://fais.world/api/admin/ai-tools/generate-article \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_internal_api_key" \
  -d '{"topic": "Test Article", "keywords": ["test"], "wordCount": 500}'

# Test authentication
curl -I https://fais.world/api/admin/ai-tools/generate-article \
  -H "Authorization: Bearer your_internal_api_key"
```

## Production Deployment Checklist

- [ ] Set `INTERNAL_API_KEY` environment variable
- [ ] Set `NODE_ENV=production` environment variable
- [ ] Set `OPENAI_API_KEY` environment variable
- [ ] Run cron setup script
- [ ] Update cron job with actual API key
- [ ] Test manual generation
- [ ] Verify logs directory exists and is writable
- [ ] Test automated generation works
- [ ] Monitor first scheduled run

## Security Notes

- Keep the `INTERNAL_API_KEY` secret and rotate it periodically
- Use a strong, randomly generated key (minimum 32 characters)
- Monitor logs for unauthorized access attempts
- The admin panel remains blocked on production domain for security
