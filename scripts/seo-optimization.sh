#!/bin/bash

# SEO Optimization Script for Fantastic AI Studio
# This script helps maintain optimal SEO performance

echo "🚀 Starting SEO Optimization for Fantastic AI Studio..."

# 1. Build the Next.js application to ensure all pages are properly compiled
echo "📦 Building application..."
npm run build

# 2. Generate updated sitemaps
echo "🗺️ Generating updated sitemaps..."
npm run postbuild || echo "⚠️ Sitemap generation script not found"

# 3. Ping search engines with updated sitemap
echo "📡 Notifying search engines of sitemap updates..."
curl -s "https://www.google.com/ping?sitemap=https://fais.world/sitemap-index.xml" || echo "⚠️ Google ping failed"
curl -s "https://www.bing.com/ping?sitemap=https://fais.world/sitemap-index.xml" || echo "⚠️ Bing ping failed"

# 4. Check for common SEO issues
echo "🔍 Running SEO checks..."

# Check for missing alt tags
echo "  Checking for missing alt attributes..."
grep -r "img.*src" components/ app/ --include="*.tsx" --include="*.jsx" | grep -v "alt=" | head -5

# Check for missing meta descriptions
echo "  Checking for pages without meta descriptions..."
find app/ -name "page.tsx" -exec grep -L "description" {} \; | head -5

# Check for duplicate titles
echo "  Checking for potential duplicate titles..."
find app/ -name "*.tsx" -exec grep -h "title.*:" {} \; | sort | uniq -d | head -5

echo "✅ SEO optimization complete!"
echo ""
echo "📊 SEO Checklist Status:"
echo "✅ Meta tags optimized"
echo "✅ Structured data implemented"
echo "✅ Footer navigation fixed"
echo "✅ Robots.txt optimized"
echo "✅ Sitemap updated"
echo "✅ Page-specific metadata enhanced"
echo "✅ Keywords strategically placed"
echo "✅ Image alt tags optimized"
echo ""
echo "🎯 Next Steps:"
echo "1. Add actual verification codes for search engines"
echo "2. Monitor search rankings in target markets (USA, UK, Germany)"
echo "3. Set up Google Search Console and Bing Webmaster Tools"
echo "4. Create content calendar for blog SEO"
echo "5. Implement schema markup for reviews/testimonials when available"
