# Sitemap Management

## About this Sitemap
This sitemap is configured to help search engines discover and index the key pages of the Fantastic AI Studio website. 

## How to Update
The sitemap is automatically updated during the build process using the next-sitemap package.
You can also manually update it by running:

```bash
npm run generate-sitemap
```

## Sitemap Features
- Includes all primary pages with appropriate priorities
- Properly sets change frequencies
- Updates lastmod dates automatically
- Follows Google's recommendations for sitemap structure

## Priority Guide
- 1.0: Homepage
- 0.9: Primary service pages
- 0.8: About, Projects, Contact
- 0.7: Secondary service pages
- 0.5: Legal pages

## Sitemap Testing
You can validate this sitemap at:
https://www.xml-sitemaps.com/validate-xml-sitemap.html
