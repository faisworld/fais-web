/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fais.world',
  generateRobotsTxt: false, // You already have a custom robots.txt
  outDir: './public',
  exclude: [
    '/admin*',
    '/api*', 
    '/image-fixer*',
    '/gallery/*', // Exclude dynamic gallery pages
  ],
  generateIndexSitemap: false,
  additionalPaths: async (config) => {
    const today = new Date().toISOString().split('T')[0];
    return [
      // Homepage with highest priority
      {
        loc: '/',
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: today,
      },
      // Services pages
      {
        loc: '/services',
        changefreq: 'monthly',
        priority: 0.9,
        lastmod: today,
      },
      {
        loc: '/blockchain-services',
        changefreq: 'monthly',
        priority: 0.9,
        lastmod: today,
      },
      // About page
      {
        loc: '/about',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: today,
      },
      // Projects page
      {
        loc: '/projects',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: today,
      },
      // Contact page
      {
        loc: '/contact',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: today,
      },
      // Legal pages
      {
        loc: '/privacy-policy',
        changefreq: 'yearly',
        priority: 0.5,
        lastmod: today,
      },
      {
        loc: '/terms-of-service',
        changefreq: 'yearly',
        priority: 0.5,
        lastmod: today,
      },
      // Additional services
      {
        loc: '/instant-id',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: today,
      },      // Special project page
      {
        loc: '/kvitka-poloniny',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: today,
      },
      // HTML Sitemap
      {
        loc: '/sitemap-html',
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: today,
      },
    ];
  },
}
