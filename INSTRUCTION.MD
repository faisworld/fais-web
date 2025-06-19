# 🚀 Building a Multifunctional AI Voice Assistant Platform for fais.world

---

## 🎯 Main Objectives (Vercel-Native Approach)

1. **Integrate a robust AI assistant** into fais.world, capable of real-time search, content management, SEO optimization, and user engagement.
2. **Implement a human-like animated AI widget** to create a unique, interactive user experience.
3. **Automate LinkedIn and content workflows** using your own Vercel API endpoints and LinkedIn API.
4. **Enable advanced SEO and content optimization** using OpenAI and SurferSEO APIs from your backend.
5. **Centralize workflow management** through unified backend logic and Vercel Cron Jobs.
6. **Ensure secure, scalable, and maintainable architecture** by following best practices for secrets management and modular design.
7. **Develop a user gallery API** for efficient media (image) management, supporting upload, edit, and removal operations.

---

## 🛠️ Implementation Roadmap

### 1️⃣ AI Assistant Integration

- **Set up a Vercel API route** (e.g., `/api/assistant`) to handle assistant commands.
- **Connect to Neon PostgreSQL** for content and metadata.
- **Integrate Vercel Blob Storage** for image/media management.
- **Enable admin commands** (update SEO, add blog post, link image) via API.

#### Example: Vercel API Route for Assistant Commands

```typescript
// filepath: /api/assistant.ts
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { command, data } = req.body;
    // Handle commands: update_seo, add_blog_post, link_image, etc.
    // ...existing code...
    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

---

### 2️⃣ Human-like Animated AI Widget

- **Use Three.js** in your Next.js frontend to render a 3D head model.
- **Sync facial animations** with AI speech using the Web Speech API or VAPI events.
- **Integrate with your assistant API** for real-time interaction.

---

### 3️⃣ LinkedIn & Content Workflow Automation

- **Create a Vercel API route** (e.g., `/api/linkedin`) to post updates to LinkedIn using the LinkedIn API.
- **Authenticate with OAuth2** and store tokens securely in Vercel environment variables.
- **Trigger LinkedIn posts** from admin commands or scheduled jobs.

#### Example: LinkedIn Post API Route

```typescript
// filepath: /api/linkedin.ts
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content } = req.body;
    // Use LinkedIn API to post content
    // ...existing code...
    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

---

### 4️⃣ SEO & Content Optimization

- **Integrate OpenAI and SurferSEO APIs** in your backend for content/SEO suggestions.
- **Update metadata in Neon PostgreSQL** via API routes.

---

### 5️⃣ Real-Time Search & RAG

- **Use Vercel AI SDK** for Retrieval-Augmented Generation.
- **Optionally deploy MeiliSearch** for fast search and connect via API.

---

### 6️⃣ Gallery API (Media Management)

- **Implement REST API endpoints** for image upload, edit, and removal.
- **Store metadata in Neon PostgreSQL** and files in Vercel Blob Storage.

---

## 🖥️ Terminal Management & Debugging Guide

### Working with Multiple Terminals

**Important**: When working with multiple terminals, GitHub Copilot may not always display terminal outputs correctly. Here are best practices:

#### Terminal Best Practices:
1. **Close Unused Terminals**: Keep only necessary terminals open to avoid confusion
2. **Check Current Working Directory**: Always verify you're in the correct project directory
3. **Monitor Background Processes**: Use `ps aux | grep node` to check running processes
4. **Kill Processes When Needed**: `taskkill /F /IM node.exe` (Windows) or `pkill node` (Unix)

#### Viewing API Responses:
When testing streaming APIs (like RAG queries), responses appear in special format:
```bash
# Example streaming response format:
f:{"messageId":"msg-xyz123"}
0:"According"
0:" to"
0:" Fantastic"
0:" AI"
0:" Studio"
```

#### Debugging Tips:
- **Check Server Logs**: Monitor console output for errors
- **Test APIs Directly**: Use curl commands to test endpoints
- **Verify Database Connections**: Check PostgreSQL connectivity
- **Monitor Port Usage**: Ensure services run on expected ports

#### Common Commands:
```bash
# Start development server
npm run dev

# Test API endpoint
curl -X POST http://localhost:3000/api/rag-query \
  -H "Content-Type: application/json" \
  -d '{"query": "test query", "topK": 3}'

# Check running processes
netstat -ano | findstr :3000
```

---

### 7️⃣ Code Quality & Standards

#### ESLint and Code Formatting Rules ✅
- **Follow ESLint Configuration**: Adhere to project's ESLint rules in `eslint.config.mjs`
- **TypeScript Standards**: Use proper TypeScript types and interfaces
- **Import Organization**: Keep imports clean and organized
- **Variable Naming**: Use descriptive camelCase naming
- **Error Handling**: Implement proper try-catch blocks and error boundaries

#### Code Style Requirements:
```typescript
// ✅ Good: Proper TypeScript interface
interface UserData {
  id: string;
  name: string;
  email: string;
}

// ✅ Good: Error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API call failed:', error);
  throw new Error('Failed to fetch data');
}

// ✅ Good: Descriptive variable names
const userAuthenticationToken = generateToken();
```

#### Markdown Documentation Standards:
- **Headers**: Use proper heading hierarchy (##, ###, ####)
- **Lists**: Add blank lines around lists
- **Code Blocks**: Surround with blank lines
- **No Trailing Punctuation**: Avoid colons in headings
- **Consistent Formatting**: Follow MD linting rules

#### File Organization:
- **Components**: Place in appropriate directories
- **Utils**: Keep utility functions organized
- **Types**: Define in dedicated type files
- **Tests**: Co-locate with source files

---

### 8️⃣ Security & Best Practices

- **Store all secrets** in Vercel’s environment variable storage.
- **Never commit secrets** to your repo.

---

## 🤖 GitHub Copilot Guidelines

### Code Generation Standards:
- **Always validate generated code** for ESLint compliance
- **Review TypeScript types** and ensure proper typing
- **Check error handling** in all generated functions
- **Verify imports** are correct and organized
- **Test functionality** before committing

### Documentation Requirements:
- **Follow Markdown linting rules** (MD022, MD026, MD031, MD032)
- **Use proper heading hierarchy** 
- **Add blank lines around lists and code blocks**
- **Avoid trailing punctuation in headings**
- **Ensure consistent formatting**

### Terminal and Debugging:
- **Close unused terminals** to avoid confusion
- **Understand streaming response formats** (f:{"messageId"}, 0:"text")
- **Check server logs** for error diagnosis
- **Use proper curl commands** for API testing
- **Monitor database connections** and query performance

### Quality Assurance:
- **Run ESLint before suggesting code changes**
- **Validate all code examples** work correctly
- **Ensure proper TypeScript interfaces**
- **Check for security best practices**
- **Verify environment variable usage**

---

## ✅ Next Steps

1. **Follow Code Standards**: Ensure all code adheres to ESLint rules and TypeScript best practices
2. Implement `/api/assistant` for AI assistant commands
3. Build the animated AI widget in your frontend
4. Set up `/api/linkedin` for LinkedIn automation
5. Integrate OpenAI/SurferSEO for SEO/content
6. Add real-time search with Vercel AI SDK
7. Complete the gallery API for media management
8. Store all secrets in Vercel's environment storage
9. **Run ESLint checks** before committing code
10. **Update documentation** following Markdown standards

---

## 🔧 Development Workflow

### Before Each Commit:
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type checking
npm run type-check

# Run tests
npm test
```

### Code Review Checklist:
- [ ] ESLint rules followed
- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] Tests passing
- [ ] No hardcoded secrets

---

**Need code samples, workflow diagrams, or step-by-step setup for any part? Just ask!**
