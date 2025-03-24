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
8. [Contact Form (SMTP Gmail)](contact-form-smtp-gmail)  
9. [SEO & Accessibility](#seo--accessibility)  
10. [Future Enhancements](#future-enhancements)

---

## Project Overview

This is a static and server-rendered website (Next.js hybrid) used as a digital identity and service showcase for **Fantastic AI Studio** (fais.world). The project emphasizes clean design, speed, and minimalism while integrating advanced features like an AI assistant and contact capabilities.

## System Requirements

- Node.js 18+
- npm 9+
- Git
- Ubuntu (WSL2 for Windows users)

> Optional: VS Code with WSL extension for easier development

## Project Structure

```bash
fais-web/
├── components/            # Reusable React components
│   ├── Layout.js          # Layout component (header, footer wrapper)
│   ├── Navbar.js          # Site navigation bar
│   ├── Footer.js          # Site footer
│   └── AssistantWidget.js # VAPI AI assistant widget integration
├── pages/                 # Next.js pages for routes
│   ├── index.js           # Home page
│   ├── about.js           # About page
│   ├── services.js        # Services page
│   ├── contact.js         # Contact page
│   ├── admin/             # Admin pages (protected)
│   │   ├── index.js       # Admin dashboard
│   │   └── login.js       # Admin login page
│   └── api/               # API route handlers (serverless functions)
│       ├── contact.js     # API endpoint for contact form submissions
│       └── auth/          # Authentication endpoints
├── lib/                   # Library code and utilities
│   ├── emailTemplate.js   # Email template for contact form
│   └── verifyRecaptcha.js # reCAPTCHA verification utility
├── public/                # Static assets (served at site root)
│   ├── favicon.ico        # Favicon and other icons
│   ├── robots.txt         # SEO: search engine directives
│   └── sitemap.xml        # SEO: site map for search engines
├── styles/                # Global styles and Tailwind CSS config
│   └── globals.css        # Global CSS (includes Tailwind directives)
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration settings
├── next-seo.config.js     # SEO default configurations for next-seo
├── .env.example           # Sample environment variables
├── .env                   # Actual environment variables (git-ignored)
├── package.json           # Node.js dependencies and scripts
└── README.md              # Project documentation
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
npm install next-auth
npm install react react-dom next
npm install tailwindcss postcss autoprefixer
npm install nodemailer
npx tailwindcss init -p
```

### Step 3: Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required environment variables:

- SMTP credentials for contact form
- VAPI credentials for AI assistant integration
- NextAuth.js secret for admin authentication
- reCAPTCHA v3 site and secret keys

### Step 4: Run Development Server

```bash
npm run dev
```

The site will be available at <http://localhost:3000>

---

## Environment Variables and Security

### Handling .env Files

The `.env` file contains sensitive information and is intentionally ignored by Git for security reasons. Follow these best practices:

1. **Never commit .env files**: The `.gitignore` file is correctly set up to exclude `.env`
2. **Use .env.example as a template**: The `.env.example` file serves as a template with placeholder values
3. **Securely share credentials**: Use password managers or secure channels to share actual credentials among team members

### Updating and Freezing Dependencies

To update dependencies to their latest compatible versions:

```bash
npm run deps:update
```

To freeze dependencies at their current versions (creates npm-shrinkwrap.json):

```bash
npm run deps:freeze
```

---

## Running the Application Locally

### Step 1: Launch Development Server

```bash
npm run dev
```

Access the site at `http://localhost:3000`

### Step 2: Test Contact Form & Widget

- Submit the contact form to ensure emails are sent properly
- Check that the AI assistant loads in the bottom corner
- Verify that reCAPTCHA is working on the contact form

---

## Deploying to Vercel

1. Go to [vercel.com](https://vercel.com/) and log in
2. Create a new project, import from GitHub
3. Add environment variables via the Vercel dashboard (same as `.env`)
4. Set build command: `npm run build` and output directory: `out` *(only if exporting static)*
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

## Contact Form (SMTP Gmail) with reCAPTCHA

The contact form submits via `/api/contact.js`, which uses **Nodemailer** to send emails through Gmail SMTP and verifies with reCAPTCHA v3.

SMTP config:

```env
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

Make sure to enable "Allow less secure apps" in your Google account or generate an App Password if using 2FA.

---

## Admin Authentication

The admin panel is protected by NextAuth.js using credentials authentication:

```env
ADMIN_USER=admin
ADMIN_PASS=secure_password_here
NEXTAUTH_SECRET=random_secure_string
NEXTAUTH_URL=http://localhost:3000
```

Access the admin panel at `/admin` and log in with the credentials specified in your environment variables.

---

## SEO & Accessibility

- **SEO** is handled using `next-seo` with defaults set in `next-seo.config.js`
- **robots.txt** and **sitemap.xml** are located in `/public`
- Semantic tags and contrast-friendly styles support screen readers
- Use [Lighthouse](https://pagespeed.web.dev/) to audit performance, SEO, accessibility

---

## Future Enhancements

- 🌐 Multi-language support via `next-i18next` (Ukrainian planned)
- 📈 Analytics integration (Google Analytics or Vercel Analytics)
- 🧠 Extend AI Assistant: add voice, dynamic intents, fallback handling
- 📝 Add blog/news section for SEO improvement
- ♿ Conduct WCAG 2.1 audit for full accessibility compliance

---

For questions or support, contact [info@fais.world](mailto:info@fais.world)
