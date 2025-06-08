# Google Structured Data Testing Guide

## 🧪 How to Test Your Structured Data

### 1. Google Rich Results Test

**Best for**: Testing individual pages for rich snippet eligibility

1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your page URL (e.g., `https://fais.world/services`)
3. Wait for analysis to complete
4. Review detected structured data types
5. Check for any validation errors or warnings

### 2. Schema.org Validator

**Best for**: Comprehensive schema validation

1. Visit [Schema.org Validator](https://validator.schema.org/)
2. Enter your page URL
3. Review detailed schema analysis
4. Verify all properties are correctly formatted

### 3. Google Search Console

**Best for**: Production monitoring and Google-specific issues

1. Access [Google Search Console](https://search.google.com/search-console)
2. Navigate to "Experience" → "Structured data"
3. Monitor for validation errors
4. Track rich results performance

## 🔍 Key URLs to Test

### Production URLs (when deployed):
- Homepage: `https://fais.world/`
- Services: `https://fais.world/services`
- AI Services: `https://fais.world/ai-services`
- Blockchain Services: `https://fais.world/blockchain-services`
- Contact: `https://fais.world/contact`
- Blog Post: `https://fais.world/blog/latest-advancements-in-large-language-models-2025`

### Local Testing URLs:
- Homepage: `http://localhost:3001/`
- Services: `http://localhost:3001/services`
- AI Services: `http://localhost:3001/ai-services`
- Blockchain Services: `http://localhost:3001/blockchain-services`
- Contact: `http://localhost:3001/contact`
- Blog Post: `http://localhost:3001/blog/latest-advancements-in-large-language-models-2025`

## ✅ Expected Results

### Homepage
- ✅ Organization
- ✅ WebSite
- ✅ Service
- ✅ ItemList

### Service Pages
- ✅ Organization
- ✅ WebSite
- ✅ ProfessionalService
- ✅ BreadcrumbList

### Contact Page
- ✅ Organization
- ✅ WebSite
- ✅ FAQPage
- ✅ BreadcrumbList

### Blog Posts
- ✅ Organization
- ✅ WebSite
- ✅ Blog
- ✅ Article
- ✅ BreadcrumbList

## 🚀 Local Testing Command

Run this to test locally:
```bash
cd "c:\Users\solar\Projects\fais-web"
npm run dev  # Starts server on localhost:3001
node validate-structured-data.cjs  # Runs automated validation
```

## 📊 Success Indicators

- **No validation errors** in Google Rich Results Test
- **All schema types detected** as expected
- **Green checkmarks** for all structured data in Google Search Console
- **Valid JSON-LD** output in page source
