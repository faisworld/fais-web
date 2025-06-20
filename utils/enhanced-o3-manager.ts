/**
 * Enhanced O3 Manager with Better Context Awareness
 * Provides intelligent website analysis with relevant file context
 */

import * as fs from 'fs';
import * as path from 'path';

// Define file extensions to include in context
const RELEVANT_EXTENSIONS = ['.tsx', '.ts', '.js', '.json', '.md', '.txt'];

// Define directories to exclude (save memory)
const EXCLUDED_DIRS = [
  '.next',
  'node_modules',
  '.git',
  'temp_images',
  'public/images',
  'archive',
  'backup-scripts',
  'seo-reports'
];

// Define file patterns to include for SEO analysis
const SEO_RELEVANT_PATTERNS = [
  'layout.tsx',
  'page.tsx',
  'metadata.ts',
  'robots.txt',
  'sitemap',
  'structured-data',
  'breadcrumb',
  'seo'
];

interface FileInfo {
  path: string;
  content: string;
  size: number;
  lastModified: Date;
}

interface WebsiteContext {
  seoFiles: FileInfo[];
  componentFiles: FileInfo[];
  configFiles: FileInfo[];
  contentFiles: FileInfo[];
  summary: {
    totalFiles: number;
    totalSize: number;
    seoImplemented: string[];
    structuredDataTypes: string[];
    metaTags: string[];
    pages: string[];
  };
}

export class EnhancedO3Manager {
  private projectRoot: string;
  private context: WebsiteContext | null = null;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  private isRelevantFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath);
    const relativePath = path.relative(this.projectRoot, filePath);

    // Include if extension is relevant
    if (!RELEVANT_EXTENSIONS.includes(ext)) return false;

    // Exclude if in excluded directory
    if (EXCLUDED_DIRS.some(dir => relativePath.startsWith(dir))) return false;

    // Include if matches SEO patterns
    if (SEO_RELEVANT_PATTERNS.some(pattern => 
      fileName.includes(pattern) || relativePath.includes(pattern)
    )) return true;

    // Include core app files
    if (relativePath.startsWith('app/') && ext === '.tsx') return true;
    if (relativePath.startsWith('components/') && ext === '.tsx') return true;
    if (relativePath.startsWith('utils/') && ext === '.ts') return true;

    return false;
  }

  private async scanDirectory(dir: string): Promise<FileInfo[]> {
    const files: FileInfo[] = [];
    
    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (!EXCLUDED_DIRS.includes(entry.name)) {
            const subFiles = await this.scanDirectory(fullPath);
            files.push(...subFiles);
          }
        } else if (this.isRelevantFile(fullPath)) {
          try {
            const stats = await fs.promises.stat(fullPath);
            const content = await fs.promises.readFile(fullPath, 'utf-8');
            
            // Limit file size to prevent memory issues
            if (stats.size < 100000) { // 100KB limit
              files.push({
                path: path.relative(this.projectRoot, fullPath),
                content: content,
                size: stats.size,
                lastModified: stats.mtime
              });
            }
          } catch (error) {
            console.warn(`Failed to read file ${fullPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to scan directory ${dir}:`, error);
    }
    
    return files;
  }

  private categorizeFiles(files: FileInfo[]): WebsiteContext {
    const seoFiles: FileInfo[] = [];
    const componentFiles: FileInfo[] = [];
    const configFiles: FileInfo[] = [];
    const contentFiles: FileInfo[] = [];

    const seoImplemented: Set<string> = new Set();
    const structuredDataTypes: Set<string> = new Set();
    const metaTags: Set<string> = new Set();
    const pages: Set<string> = new Set();

    let totalSize = 0;

    for (const file of files) {
      totalSize += file.size;

      // Categorize files
      if (file.path.includes('seo') || 
          file.path.includes('structured-data') || 
          file.path.includes('breadcrumb') ||
          file.path.includes('robots.txt') ||
          file.path.includes('sitemap')) {
        seoFiles.push(file);
      } else if (file.path.startsWith('components/')) {
        componentFiles.push(file);
      } else if (file.path.includes('config') || 
                 file.path.includes('package.json') ||
                 file.path.includes('vercel.json')) {
        configFiles.push(file);
      } else {
        contentFiles.push(file);
      }

      // Analyze content for SEO features
      const content = file.content.toLowerCase();

      // Detect SEO implementations
      if (content.includes('metadata')) seoImplemented.add('Meta Tags');
      if (content.includes('opengraph')) seoImplemented.add('Open Graph');
      if (content.includes('twitter')) seoImplemented.add('Twitter Cards');
      if (content.includes('application/ld+json')) seoImplemented.add('Structured Data');
      if (content.includes('breadcrumb')) seoImplemented.add('Breadcrumbs');
      if (content.includes('sitemap')) seoImplemented.add('Sitemap');
      if (content.includes('robots')) seoImplemented.add('Robots.txt');

      // Detect structured data types
      if (content.includes('"@type": "organization"')) structuredDataTypes.add('Organization');
      if (content.includes('"@type": "website"')) structuredDataTypes.add('Website');
      if (content.includes('"@type": "article"')) structuredDataTypes.add('Article');
      if (content.includes('"@type": "service"')) structuredDataTypes.add('Service');
      if (content.includes('"@type": "faqpage"')) structuredDataTypes.add('FAQ');
      if (content.includes('"@type": "breadcrumblist"')) structuredDataTypes.add('Breadcrumb');

      // Detect meta tags
      if (content.includes('title:')) metaTags.add('Title');
      if (content.includes('description:')) metaTags.add('Description');
      if (content.includes('keywords:')) metaTags.add('Keywords');
      if (content.includes('canonical:')) metaTags.add('Canonical');

      // Detect pages
      if (file.path.includes('page.tsx')) {
        const pagePath = file.path.replace('/page.tsx', '') || 'homepage';
        pages.add(pagePath);
      }
    }

    return {
      seoFiles,
      componentFiles,
      configFiles,
      contentFiles,
      summary: {
        totalFiles: files.length,
        totalSize,
        seoImplemented: Array.from(seoImplemented),
        structuredDataTypes: Array.from(structuredDataTypes),
        metaTags: Array.from(metaTags),
        pages: Array.from(pages)
      }
    };
  }

  async buildContext(): Promise<WebsiteContext> {
    if (this.context) return this.context;

    console.log('🔍 Building website context for O3 analysis...');
    const startTime = Date.now();

    const files = await this.scanDirectory(this.projectRoot);
    this.context = this.categorizeFiles(files);

    const endTime = Date.now();
    console.log(`✅ Context built: ${this.context.summary.totalFiles} files (${Math.round(this.context.summary.totalSize / 1024)}KB) in ${endTime - startTime}ms`);

    return this.context;
  }

  async getSEOAnalysisContext(): Promise<string> {
    const context = await this.buildContext();
    
    return `
# Website SEO Context Analysis

## Current SEO Implementation Status
${context.summary.seoImplemented.map(item => `✅ ${item}`).join('\n')}

## Structured Data Types Found
${context.summary.structuredDataTypes.map(type => `✅ ${type} Schema`).join('\n')}

## Meta Tags Implemented
${context.summary.metaTags.map(tag => `✅ ${tag}`).join('\n')}

## Pages Analyzed
${context.summary.pages.map(page => `• ${page}`).join('\n')}

## Key SEO Files
${context.seoFiles.map(file => `• ${file.path} (${Math.round(file.size / 1024)}KB)`).join('\n')}

## File Analysis Summary
- **Total Files**: ${context.summary.totalFiles}
- **Total Size**: ${Math.round(context.summary.totalSize / 1024)}KB
- **SEO Files**: ${context.seoFiles.length}
- **Component Files**: ${context.componentFiles.length}
- **Content Files**: ${context.contentFiles.length}

## Memory Optimization
- Excluded directories: ${EXCLUDED_DIRS.join(', ')}
- File size limit: 100KB per file
- Relevant extensions only: ${RELEVANT_EXTENSIONS.join(', ')}

This context provides comprehensive SEO analysis data while maintaining memory efficiency.
    `.trim();
  }

  async getFileContent(relativePath: string): Promise<string | null> {
    const context = await this.buildContext();
    const file = [...context.seoFiles, ...context.componentFiles, ...context.contentFiles]
      .find(f => f.path === relativePath);
    
    return file ? file.content : null;
  }

  getContextSummary(): string | null {
    if (!this.context) return null;

    return `
Website Context Summary:
- ${this.context.summary.totalFiles} relevant files loaded
- ${Math.round(this.context.summary.totalSize / 1024)}KB total size
- SEO Features: ${this.context.summary.seoImplemented.join(', ')}
- Structured Data: ${this.context.summary.structuredDataTypes.join(', ')}
- Pages: ${this.context.summary.pages.length} pages found
    `.trim();
  }
}

// Export singleton instance
export const o3Manager = new EnhancedO3Manager();
