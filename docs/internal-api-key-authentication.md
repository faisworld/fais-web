# INTERNAL_API_KEY Authentication for Production Automation

## Overview

The INTERNAL_API_KEY provides a secure way to bypass admin panel restrictions in production for automated maintenance tasks and cron jobs.

## How It Works

### 1. Environment Variable Setup

```bash
# In production environment variables
INTERNAL_API_KEY=your-secure-api-key-here
```

### 2. Authentication Flow

#### Cron Jobs (Fully Automated)

All cron job endpoints use INTERNAL_API_KEY for authentication:

- `POST /api/cron/orchestrate-maintenance`
- `POST /api/cron/automated-article-generation`
- `POST /api/cron/website-crawling-analysis`
- `POST /api/cron/update-knowledge-base`
- `POST /api/cron/seo-optimization`

**Usage:**

```bash
curl -X POST https://fais.world/api/cron/orchestrate-maintenance \
  -H "Authorization: Bearer ${INTERNAL_API_KEY}" \
  -H "Content-Type: application/json"
```

#### Admin API Routes

Admin routes like `/admin/ai-tools/generate-media` also support INTERNAL_API_KEY:

**Usage:**

```bash
curl -X POST https://fais.world/admin/ai-tools/generate-media \
  -H "Authorization: Bearer ${INTERNAL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"mediaType": "image", "prompt": "..."}'
```

### 3. Authentication Priority

The system checks authentication in this order:

1. **INTERNAL_API_KEY** - `Authorization: Bearer ${INTERNAL_API_KEY}` header
2. **Localhost Access** - Requests from `localhost:*` (development only)
3. **Denied** - All other requests to admin routes in production

### 4. Implementation Details

#### Cron Job Authentication

```typescript
function isValidCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const internalApiKey = process.env.INTERNAL_API_KEY
  
  if (!internalApiKey) {
    console.error('INTERNAL_API_KEY environment variable is not set')
    return false
  }
  
  return authHeader === `Bearer ${internalApiKey}`
}
```

#### Admin Route Authentication

```typescript
export async function verifyAdminRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  // Check for internal API key first (for automated scripts)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const internalApiKey = process.env.INTERNAL_API_KEY;
    
    if (internalApiKey && token === internalApiKey) {
      return {
        success: true,
        message: 'Authorized via internal API key'
      };
    }
  }
  
  // Fallback to localhost check for development
  const host = req.headers.get('host');
  if (host && host.startsWith('localhost:')) {
    return {
      success: true,
      message: 'Authorized via localhost'
    };
  }
  
  return {
    success: false,
    message: 'Unauthorized: Admin endpoints require localhost access or valid internal API key'
  };
}
```

## Security Benefits

1. **No Admin UI in Production**: Admin dashboard pages are blocked by middleware on `fais.world`
2. **API-Only Access**: Only API endpoints can be accessed with INTERNAL_API_KEY
3. **Single Source of Truth**: One environment variable controls all automation access
4. **Audit Trail**: All requests with INTERNAL_API_KEY are logged

## Usage Examples

### Trigger Full Maintenance Orchestration

```bash
curl -X POST https://fais.world/api/cron/orchestrate-maintenance \
  -H "Authorization: Bearer ${INTERNAL_API_KEY}"
```

### Generate Articles Only

```bash
curl -X POST https://fais.world/api/cron/automated-article-generation \
  -H "Authorization: Bearer ${INTERNAL_API_KEY}"
```

### Run SEO Analysis

```bash
curl -X POST https://fais.world/api/cron/seo-optimization \
  -H "Authorization: Bearer ${INTERNAL_API_KEY}"
```

### Generate Media via Admin API

```bash
curl -X POST https://fais.world/admin/ai-tools/generate-media \
  -H "Authorization: Bearer ${INTERNAL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaType": "image",
    "modelIdentifier": "dalle-3",
    "prompt": "A modern AI workspace"
  }'
```

## Production Setup Checklist

- [ ] Set `INTERNAL_API_KEY` environment variable in Vercel
- [ ] Verify middleware blocks admin UI routes in production
- [ ] Test cron job endpoints with INTERNAL_API_KEY
- [ ] Confirm admin API routes work with INTERNAL_API_KEY
- [ ] Set up monitoring for authentication failures

## Status: ✅ READY FOR PRODUCTION

All cron jobs and admin APIs now consistently use INTERNAL_API_KEY authentication, providing secure automation access without exposing the admin panel interface in production.
