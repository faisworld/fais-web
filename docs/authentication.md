# Authentication System Documentation

The FAIS website includes a secure authentication system to protect the admin section.

## Overview

The authentication system uses NextAuth.js to provide secure access to the admin panel. It supports:

- Email/Password authentication
- OAuth providers (Google, GitHub)
- Role-based access control
- Development mode bypass for easier local development

## Development Mode Bypass

In development or preview environments (`NODE_ENV === 'development'` or `VERCEL_ENV === 'preview'`), authentication is automatically bypassed. This allows for easier testing and development without needing to log in.

## Production Authentication

In production, proper authentication is enforced with:

1. JWT-based sessions
2. Admin role verification
3. Secure credential storage using environment variables

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```
# NextAuth
# Generate a secret using `openssl rand -base64 32`
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://your-production-url.com"

# Admin credentials
ADMIN_EMAIL="your-admin-email@example.com"
ADMIN_PASSWORD="your-secure-password"

# OAuth Providers (optional)
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Add More Admin Users

To add more admin users, update the `ADMIN_EMAILS` array in `lib/auth.ts`:

```typescript
const ADMIN_EMAILS = [
  "admin@fais.com",
  "your-email@example.com",
  process.env.ADMIN_EMAIL,
  // Add more admin emails as needed
].filter(Boolean);
```

## Authentication Flow

1. Users visit `/admin/login` to authenticate
2. Upon successful login with admin credentials, they are redirected to the admin dashboard
3. All admin routes are protected with session checks
4. The middleware and layout components handle auth protection at multiple levels

## Logout

Use the logout button in the admin header to securely end your session.
