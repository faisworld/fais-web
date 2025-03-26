# INSTRUCTIONS.md – Fantastic AI Studio Website

This document provides comprehensive technical instructions for setting up, customizing, and maintaining the **Fantastic AI Studio** company website built with Next.js and Tailwind CSS.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [Running the Application Locally](#running-the-application-locally)
6. [Deploying to Vercel](#deploying-to-vercel)
7. [AI Assistant Integration (VAPI)](#ai-assistant-integration-vapi)
8. [Contact Form (SMTP Gmail)](#contact-form-smtp-gmail)
9. [SEO & Accessibility](#seo--accessibility)
10. [Admin Panel & Authentication](#admin-panel--authentication)
11. [Future Enhancements](#future-enhancements)

---

## Project Overview

This is a static and server-rendered website (Next.js hybrid) used as a digital identity and service showcase for **Fantastic AI Studio** (fais.world). The project emphasizes clean design, speed, and minimalism while integrating advanced features like an AI assistant, contact form, and protected admin area.

## System Requirements

- Node.js 18+
- npm 9+
- Git
- Ubuntu (WSL2 for Windows users)

> Optional: VS Code with WSL extension for easier development

## Project Structure

```
fais-web/
├── components/            # Header, Footer, Layout, Assistant Widget
│   └── admin/             # Admin-specific layouts and widgets
├── pages/                 # Home, About, Services, Contact, Admin, API routes
│   └── admin/             # Login and dashboard pages
├── public/                # Static assets, favicon, robots.txt, sitemap.xml
├── styles/                # Tailwind and global styles
├── docs/                  # Developer references and Copilot context files
├── .env.example           # Sample environment variables
├── next.config.js         # Next.js configuration
├── next-seo.config.js     # SEO defaults
└── package.json           # Dependencies and scripts
```

---

## Environment Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/faisworld/fais-web.git
cd fais-web
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with the following fields:

```env
# SMTP for contact form
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# AI Assistant (VAPI)
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_id
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key

# NextAuth (for admin auth)
NEXTAUTH_SECRET=your_secure_secret_key
NEXTAUTH_URL=http://localhost:3000

# Metadata
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Fantastic AI Studio
```

> Use [Google App Passwords](https://support.google.com/accounts/answer/185833) for SMTP if 2FA is enabled.

---

## Running the Application Locally

### Step 1: Launch Development Server

```bash
npm run dev
```

Access the site at `http://localhost:3000`

### Step 2: Test Contact Form & Widget

- Submit the contact form
- Check the AI assistant loads in the bottom corner

---

## Deploying to Vercel

1. Go to [vercel.com](https://vercel.com/) and log in
2. Create a new project, import from GitHub
3. Add environment variables via the Vercel dashboard (same as `.env`)
4. Set build command: `npm run build` and output directory: `out` _(only if exporting static)_
5. Deploy and assign a custom domain (e.g., fais.world)

---

## AI Assistant Integration (VAPI)

The assistant is embedded via `components/AssistantWidget.js`. It uses your unique VAPI assistant ID and public API key from their dashboard.

Ensure these credentials are defined in `.env`:

```env
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_id
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
```

The widget script is loaded via `useEffect`, so no SSR conflict.

---

## Contact Form (SMTP Gmail)

The contact form submits via `/api/contact.js`, which uses **Nodemailer** to send emails through Gmail SMTP.

SMTP config:

```env
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

Make sure to enable "Allow less secure apps" in your Google account or generate an App Password if using 2FA.

---

## SEO & Accessibility

- **SEO** is handled using `next-seo` with defaults set in `next-seo.config.js`
- **robots.txt** and **sitemap.xml** are located in `/public`
- Semantic tags and contrast-friendly styles support screen readers
- Use [Lighthouse](https://pagespeed.web.dev/) to audit performance, SEO, accessibility

---

## Admin Panel & Authentication

The `/admin` route is protected with **NextAuth.js** to allow only authenticated users access to the dashboard.

### Steps to Enable Admin Access:

1. Create a login page at `pages/admin/login.js`
2. Protect admin routes using `getServerSideProps` with session checks
3. Use NextAuth.js providers (e.g., credentials or GitHub)
4. Add a secure `NEXTAUTH_SECRET` to `.env`
5. Wrap the app in `<SessionProvider>` (update `_app.js`)

Environment variables:

```env
NEXTAUTH_SECRET=your_secure_secret_key
NEXTAUTH_URL=http://localhost:3000
```

Once configured, visit `/admin` to log in and manage secure content.

---

## Admin Components and Pages

The following files support the admin interface:

### components/admin/DashboardLayout.js

```jsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div className="p-4">Loading...</div>;
  if (!session) {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b p-4 font-bold">Fantastic AI Admin</nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
```

### pages/admin/login.js

```jsx
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      username: e.target.username.value,
      password: e.target.password.value,
    });
    setLoading(false);
    if (result.ok) router.push('/admin');
    else alert('Invalid credentials');
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-32 p-6 border rounded"
    >
      <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="w-full mb-3 p-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full mb-3 p-2 border rounded"
        required
      />
      <button
        disabled={loading}
        className="w-full p-2 bg-black text-white rounded"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### pages/admin/index.js

```jsx
import DashboardLayout from '@/components/admin/DashboardLayout';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold mb-4">Welcome to the Admin Panel</h2>
      <p className="text-gray-600">
        Here you can manage site content and settings.
      </p>
    </DashboardLayout>
  );
}
```

---

## Future Enhancements

- 🌐 Multi-language support via `next-i18next` (Ukrainian planned)
- 📈 Analytics integration (Google Analytics or Vercel Analytics)
- 🧠 Extend AI Assistant: add voice, dynamic intents, fallback handling
- 📝 Add blog/news section for SEO improvement
- ♿ Conduct WCAG 2.1 audit for full accessibility compliance

---

For questions or support, contact [info@fais.world](mailto:info@fais.world)
