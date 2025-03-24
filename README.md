# Fantastic AI Studio Website (fais.world)

A Next.js-driven company website for **Fantastic AI Studio**, showcasing AI and blockchain solutions with a sleek modern design. This site serves as a digital portfolio and contact point for an English-speaking audience (primarily US), with plans to add Ukrainian localization in the future.

## Features

- **Multi-Page Design**: Includes dedicated pages for Home, About, Services, and Contact to provide comprehensive information.
- **AI Assistant Integration**: An embedded AI assistant widget (powered by VAPI.ai) offers interactive help and answers to visitors in real-time.
- **Contact Form**: A simple contact form on the Contact page sends inquiries via email using Google SMTP, facilitating easy communication with the studio.
- **Responsive UI**: Mobile-first, black-and-white themed design with unique Fantastic AI Studio branding accents, ensuring a consistent experience across devices.
- **SEO Optimization**: Utilizes the `next-seo` library for dynamic meta tags and Open Graph data, with a `robots.txt` and `sitemap.xml` in place to improve search engine indexing.

## Tech Stack

- **Next.js 13** – React framework for server-side rendering and routing.
- **Tailwind CSS 3** – Utility-first CSS framework for fast and responsive styling.
- **Vercel** – Hosting platform for continuous deployment and global edge delivery.
- **VAPI.ai** – Third-party AI assistant service integrated via an embedded widget.
- **next-seo** – SEO management library for Next.js to handle meta tags and SEO best practices.
- **Google SMTP (Gmail)** – Email service (via Nodemailer) for handling contact form submissions.

## Project Structure

fais-web/
├── pages/                   # Next.js pages for routes
│   ├── index.js             # Home page
│   ├── about.js             # About page
│   ├── services.js          # Services page
│   ├── contact.js           # Contact page
│   └── api/                 # API route handlers (serverless functions)
│       └── contact.js       # API endpoint for contact form submissions
├── components/              # Reusable React components
│   ├── Layout.js            # Layout component (header, footer wrapper)
│   ├── Navbar.js            # Site navigation bar
│   ├── Footer.js            # Site footer
│   └── AssistantWidget.js   # VAPI AI assistant widget integration
├── styles/                  # Global styles and Tailwind CSS config
│   ├── globals.css          # Global CSS (includes Tailwind directives)
│   └── tailwind.config.js   # Tailwind configuration
├── public/                  # Public assets (served at site root)
│   ├── favicon.ico          # Favicon and other icons
│   ├── robots.txt           # SEO: search engine directives
│   └── sitemap.xml          # SEO: site map for search engines
├── next.config.js           # Next.js configuration settings
├── next-seo.config.js       # SEO default configurations for next-seo
├── package.json             # Node.js dependencies and scripts
└── README.md                # Project documentation (this file)

## Getting Started

Follow these steps to run the project locally (tested on WSL2 Ubuntu for Windows 10/11, but similar for any Unix-like environment):

1. **Clone the repository**  

   git clone <https://github.com/faisworld/fais-web.git>
   cd fais-web

2. **Install dependencies**  

   npm install

3. **Copy and edit environment variables**  
   Copy the example environment file and then edit the new `.env` file with the required configuration values.  

   cp .env.example .env

   Open the `.env` file in an editor and update the placeholders (especially for SMTP and VAPI credentials). For example:  

   ```env
   # Google SMTP credentials for contact form emails
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_gmail_app_password

   # VAPI AI Assistant configuration
   NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id

   # (Optional) Site metadata
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=Fantastic AI Studio
   ```

4. **Start the development server**  

   npm run dev  

   This will launch the Next.js development server. Open your browser to **<http://localhost:3000>** to view the site. Any code changes will hot-reload in the browser.

5. **Build for production (optional)**  
   To test a production build locally, run:  

   npm run build
   npm start  

   This generates an optimized build in the `.next` directory and starts a Node.js server to serve the production version.

## Deployment (Vercel)

The site is designed for deployment on **Vercel** for seamless CI/CD and hosting:

1. **Vercel Setup**: Sign up for a Vercel account and install the Vercel CLI (if not already).
2. **Import Project**: In Vercel's dashboard, create a new project by importing the Git repository. Alternatively, use the CLI: `vercel link` inside the project directory.
3. **Environment Variables**: In the Vercel project settings, configure the same environment variables as in your `.env` (e.g., `SMTP_USER`, `SMTP_PASS`, `NEXT_PUBLIC_VAPI_ASSISTANT_ID`, etc.) for the production environment.
4. **Deploy**: Vercel will automatically build and deploy the site on every push to the main branch. For manual deployment, you can run `vercel --prod`.
5. **Custom Domain**: If using a custom domain (e.g. **fais.world**), add it in the Vercel domain settings and update DNS records as instructed by Vercel.
6. **Post-Deployment**: Once deployed, the site will be live on Vercel's global network. Verify that all pages are working, and the AI assistant and contact form function correctly in production.

## SEO & Accessibility Best Practices

This project follows basic SEO and accessibility best practices:

- **Meta Tags**: Each page's meta title and description are managed via `next-seo` to ensure unique and descriptive content for search engines and social sharing.
- **Sitemap & Robots**: The `public/sitemap.xml` provides search engines with a map of the site’s pages, and `public/robots.txt` guides indexing (e.g., allowing/disallowing appropriate content).
- **Semantic HTML**: The site uses semantic HTML5 elements (e.g., headings, nav, footer) to improve accessibility and SEO understanding of content structure.
- **Alt Text**: All informative images include appropriate `alt` attributes for accessibility and better SEO. Non-essential graphics are handled via CSS or have empty alt to be ignored by screen readers.
- **Responsive Design**: The layout is mobile-friendly and adjusts for different screen sizes, which is favored by search rankings and provides a better experience for all users.
- **Contrast and Readability**: The black-and-white design with accent colors is chosen for high contrast. Text and interactive elements maintain sufficient contrast against backgrounds to meet accessibility guidelines.
- **Keyboard Navigation**: Interactive components (like the AI chat widget and form) are usable via keyboard navigation and focus styles are tested, ensuring the site can be navigated without a mouse.

Developers should continue to follow these practices when adding new features or content, to maintain good SEO and accessibility standards (consider using tools like Lighthouse or Wave for audits).

## Next Steps

Planned enhancements and future improvements for the site:

- [ ] **Ukrainian Localization** – Implement multi-language support (e.g., using Next.js i18n routing or a library like next-i18next) and add Ukrainian content for all pages.
- [ ] **Analytics Integration** – Add analytics tracking (e.g., Google Analytics or Vercel Analytics) to gather insights on visitor behavior and traffic.
- [ ] **Blog/News Section** – Introduce a blog or news section to share updates, which can improve SEO and engage visitors with fresh content.
- [ ] **Enhanced AI Assistant** – Expand the AI assistant’s capabilities (for example, enabling voice interaction or training it with more Q&A content specific to the studio’s services).
- [ ] **SEO Improvements** – Implement structured data (Schema.org JSON-LD) for rich search results and refine content based on keyword research to improve search rankings.
- [ ] **Accessibility Audit** – Perform a thorough accessibility audit and address any issues (ensuring WCAG 2.1 AA compliance), especially after adding new features or content.

## License

Proprietary software. All rights reserved.  
*(This repository contains the official company website; unauthorized use of the code is not permitted unless explicitly licensed.)*

## Contact

For any questions or support regarding this website, please reach out to **Fantastic AI Studio** via the [Contact page](https://fais.world/contact/) or email **[info@fais.world](mailto:info@fais.world)**.
