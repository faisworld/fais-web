# Fantastic AI Studio (FAIS) Website

Welcome to the Fantastic AI Studio (FAIS) website project. This repository contains the codebase for the business website, including a landing page and a blog. The website is designed to create and manage pages seamlessly using an AI editor.

---

## Technical Documentation

- [Quirks Mode Fix](./docs/quirks-mode-fix.md) - How we ensured proper DOCTYPE and Standards Mode rendering
- [Carousel Video Setup](./docs/carousel-video-setup.md) - Adding videos to the homepage carousel
- [Authentication](./docs/authentication.md) - Admin authentication system

## Features

1. **Landing Page**
   - A visually appealing homepage to represent your business.
   - Includes sections for showcasing services, projects, testimonials, and contact information.

2. **Blog**
   - A dynamic blog section for publishing articles and updates.
   - Supports categories, tags, and search functionality.

3. **AI Editor**
   - Use the AI editor to create, edit, and manage pages effortlessly.
   - No need for an admin panel—everything is handled directly through the AI editor.

4. **Responsive Design**
   - Fully responsive and optimized for all devices.

5. **SEO-Friendly**
   - Built with SEO best practices to improve search engine visibility.

---

## How to Use

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies using `npm install` or `yarn install`.
4. Start the development server using `npm run dev` or `yarn dev`.
5. Open your browser and navigate to `http://localhost:3000` to access the website.

---

## File Structure

---

app/
├── components/
│   ├── Header.tsx              # Header with navigation links (Services, Projects, Blog, Contacts)
│   ├── Footer.tsx              # Footer with contact and legal links
│   └── pages/
│       ├── HeroSection.tsx     # Hero section with carousel
│       ├── SolutionsSection.tsx # Section showcasing AI and blockchain solutions
│       ├── QuoteSection.tsx    # Section with a quote and CEO details
├── blog/
│   ├── [slug]/
│   │   └── page.tsx            # Dynamic blog post pages
│   └── index.tsx               # Blog homepage
├── landing/
│   └── page.tsx                # Landing page
├── layout.tsx                  # Website layout
├── api/
│   ├── blog/
│   │   ├── create/
│   │   │   └── route.ts        # API route for creating blog posts
│   │   ├── edit/
│   │   │   └── [slug]/route.ts # API route for editing blog posts
│   │   └── delete/
│   │       └── [slug]/route.ts # API route for deleting blog posts
│   └── pages/
│       └── route.ts            # API route for managing pages
└── [page]/
    └── page.tsx                # Dynamic page rendering
  
---

## Future Enhancements

1. **AI-Driven Content Suggestions**
   - Integrate AI to suggest content improvements and SEO optimizations.

2. **Advanced Blog Features**
   - Add support for comments, social sharing, and related posts.

3. **Customizable Themes**
   - Allow users to switch between different themes for the website.

4. **Analytics Integration**
   - Add analytics to track website performance and user behavior.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
