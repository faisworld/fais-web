# Dynamic reCAPTCHA Implementation Guide

## Overview

This document describes the implementation of dynamic reCAPTCHA Enterprise token generation for the FAIS web application, replacing the previous static token approach that posed security risks.

## Architecture

### Client-Side Components

#### 1. reCAPTCHA Utility (`utils/recaptcha.ts`)

- **Purpose**: Centralized client-side reCAPTCHA management
- **Key Features**:
  - Dynamic script loading with error handling
  - Token generation for multiple actions
  - React hook for state management
  - TypeScript support with proper type definitions

#### 2. MailerWidget (`components/ui/MailerWidget.tsx`)

- **Updated to use**: New reCAPTCHA utility
- **Improvements**:
  - Cleaner code with centralized reCAPTCHA logic
  - Better error handling
  - Configurable actions

#### 3. Contact Page (`app/contact/page.client.tsx`)

- **Updated to use**: New script loading utility
- **Benefits**:
  - Simplified script management
  - Consistent error handling

### Server-Side Components

#### 1. reCAPTCHA Server Utility (`utils/recaptcha-server.ts`)

- **Purpose**: Server-side token verification with enhanced security
- **Key Features**:
  - Enhanced verification with IP and User-Agent validation
  - Configurable score thresholds
  - Timeout protection
  - Comprehensive error handling
  - Mock results for development/testing

#### 2. Email API Route (`app/api/send-email/route.ts`)

- **Updated to use**: Enhanced verification utility
- **Improvements**:
  - Better security with IP and User-Agent checks
  - Cleaner code structure
  - Improved logging

## Configuration

### Environment Variables Required

```bash
# Google Cloud credentials for reCAPTCHA Enterprise
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# SMTP settings (existing)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### reCAPTCHA Configuration

```typescript
export const RECAPTCHA_CONFIG = {
  SITE_KEY: "6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z",
  PROJECT_ID: "fantastic-ai-stu-1742763229808",
  SCORE_THRESHOLD: 0.5,
  ACTIONS: {
    CONTACT_FORM: "submit_contact_form",
    NEWSLETTER: "newsletter_signup",
    COMMENT: "submit_comment",
    LOGIN: "user_login",
    REGISTER: "user_register",
  }
}
```

## Usage Examples

### Client-Side Token Generation

#### Using the React Hook

```typescript
import { useRecaptcha, RECAPTCHA_CONFIG } from '@/utils/recaptcha'

function MyComponent() {
  const { isReady, generateToken, error } = useRecaptcha()
  
  const handleSubmit = async () => {
    if (isReady) {
      const result = await generateToken(RECAPTCHA_CONFIG.ACTIONS.CONTACT_FORM)
      if (result.success) {
        // Use result.token in API call
      }
    }
  }
}
```

#### Direct Token Generation

```typescript
import { generateRecaptchaToken, RECAPTCHA_CONFIG } from '@/utils/recaptcha'

const result = await generateRecaptchaToken(
  RECAPTCHA_CONFIG.ACTIONS.CONTACT_FORM,
  { waitForReady: true, timeout: 10000 }
)
```

### Server-Side Verification

#### Basic Verification

```typescript
import { verifyRecaptchaToken, SERVER_RECAPTCHA_CONFIG } from '@/utils/recaptcha-server'

const result = await verifyRecaptchaToken(token, {
  expectedAction: SERVER_RECAPTCHA_CONFIG.ACTIONS.CONTACT_FORM,
  minimumScore: 0.5
})
```

#### Enhanced Verification (Recommended)

```typescript
import { verifyRecaptchaTokenEnhanced } from '@/utils/recaptcha-server'

const result = await verifyRecaptchaTokenEnhanced(
  token,
  clientIp,
  userAgent,
  {
    expectedAction: SERVER_RECAPTCHA_CONFIG.ACTIONS.CONTACT_FORM,
    minimumScore: 0.5,
    expectedHostname: 'fais.world'
  }
)
```

## Security Features

### 1. Dynamic Token Generation

- Tokens are generated fresh for each request
- No static tokens stored in files
- Automatic token expiration handling

### 2. Enhanced Server Verification

- **IP Validation**: Rejects suspicious or private IP addresses in production
- **User-Agent Validation**: Filters out bot-like user agents
- **Score Thresholds**: Configurable minimum score requirements
- **Action Validation**: Ensures tokens are used for intended actions
- **Hostname Validation**: Optional hostname verification

### 3. Error Handling

- Graceful degradation when reCAPTCHA fails
- Detailed logging for debugging
- Timeout protection against hanging requests

### 4. Development Support

- Mock results for testing
- Development mode bypass
- Comprehensive logging

## Migration from Static Tokens

### Removed Files

- ✅ `utils/request.json` - Contained static reCAPTCHA token (security risk)
- ✅ `utils/blob-upload.js` - Redundant JavaScript version (kept TypeScript version)

### Updated Files

- ✅ `components/ui/MailerWidget.tsx` - Uses new reCAPTCHA hook
- ✅ `app/contact/page.client.tsx` - Uses new script loading utility
- ✅ `app/api/send-email/route.ts` - Uses enhanced server verification

### New Files

- ✅ `utils/recaptcha.ts` - Client-side utilities and hooks
- ✅ `utils/recaptcha-server.ts` - Server-side verification utilities

## Testing

### Manual Testing

1. Visit `/contact` page
2. Fill out contact form
3. Submit and verify in browser console:
   - reCAPTCHA script loads successfully
   - Token generation occurs
   - Form submits without errors

### Development Mode

- Set `NODE_ENV=development` or pass `isDevelopment: true` in request body
- reCAPTCHA verification is bypassed but logged
- Useful for testing without valid reCAPTCHA setup

## Best Practices

### 1. Token Lifecycle

- Generate tokens just before use
- Don't store tokens client-side
- Use appropriate action names for different forms

### 2. Error Handling

- Always handle token generation failures gracefully
- Provide fallback behavior when reCAPTCHA is unavailable
- Log verification failures for monitoring

### 3. Performance

- Use the React hook for automatic script loading
- Implement proper cleanup in components
- Consider timeout values for server verification

### 4. Security

- Use enhanced verification in production
- Monitor verification scores and adjust thresholds
- Regularly review logs for suspicious activity

## Troubleshooting

### Common Issues

#### 1. "reCAPTCHA not ready"

- **Cause**: Script loading failure or network issues
- **Solution**: Check network connectivity, verify site key

#### 2. "Action mismatch"

- **Cause**: Using wrong action name in verification
- **Solution**: Ensure client and server use same action constants

#### 3. "Score below threshold"

- **Cause**: Suspicious activity detected
- **Solution**: Review score threshold, check for bot traffic

#### 4. "Network error during verification"

- **Cause**: Google Cloud API connectivity issues
- **Solution**: Check credentials, network configuration

### Debugging

- Enable detailed logging in development
- Use browser developer tools to monitor network requests
- Check server logs for verification details

## Future Enhancements

### Potential Improvements

1. **Rate Limiting**: Per-user token generation limits
2. **Analytics**: reCAPTCHA score tracking and analysis
3. **Multiple Sites**: Support for multiple reCAPTCHA site keys
4. **Caching**: Intelligent caching of verification results
5. **Monitoring**: Automated alerts for verification failures

### Extensibility

The current implementation is designed to be easily extended:

- Add new actions in the configuration
- Implement custom verification logic
- Add additional security checks
- Integrate with monitoring systems

## Conclusion

The dynamic reCAPTCHA implementation provides:

- ✅ Enhanced security over static tokens
- ✅ Better user experience with graceful error handling
- ✅ Comprehensive server-side validation
- ✅ Clean, maintainable code structure
- ✅ TypeScript support throughout
- ✅ Development-friendly features

This implementation replaces the security risk of static tokens with a robust, scalable solution that can grow with the application's needs.
