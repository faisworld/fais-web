import { tool } from 'ai'; // Changed from ai/o3
import { z, ZodType } from 'zod';
import * as cheerio from 'cheerio';

export const CrawlWebsiteParameters = z.object({
  url: z.string().url().describe('The URL of the website page to crawl.'),
  query: z.string().optional().describe('Optional query to search for specific information on the page.'),
});

async function crawlWebsiteLogic(url: string, query?: string): Promise<string> {
  console.log(`Crawling ${url} for query: "${query || 'general content'}"`);
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'O3AssistantCrawler/1.0' } });
    if (!response.ok) {
      return `Error fetching ${url}: ${response.status} ${response.statusText}`;
    }
    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);

    $('script, style, nav, footer, aside, form').remove();

    let extractedText = $('article, main, body').text();

    if (!extractedText.trim()) {
        $('p, h1, h2, h3, h4, h5, h6, li, a, span, div').each((i, elem) => {
            const elementText = $(elem).text().trim();
            if (elementText.length > 20) {
                 extractedText += elementText + '\n';
            }
        });
    }
    
    extractedText = extractedText.replace(/\s\s+/g, ' ').trim();
    extractedText = extractedText.replace(/\n\s*\n/g, '\n').trim();

    if (query) {
      const queryLower = query.toLowerCase();
      const sentences = extractedText.split(/[.\n]/);
      let relevantText = sentences.filter(sentence => sentence.toLowerCase().includes(queryLower)).join('. ');
      if (!relevantText) {
        relevantText = "Query not found in the main content. ";
      }
      return `Content from ${url} (related to "${query}"): ${relevantText.substring(0, 2000)}...`;
    }

    return `Content from ${url}: ${extractedText.substring(0, 4000)}...`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `Failed to crawl ${url}: ${error.message}`;
    }
    return `Failed to crawl ${url}: An unknown error occurred`;
  }
}

export const crawlWebsiteTool = tool({
  description: 'Crawls a specific URL of the website to get information. Can optionally take a query to search for specific content within that page.',
  parameters: CrawlWebsiteParameters as ZodType<z.infer<typeof CrawlWebsiteParameters>>,
  execute: async ({ url, query }: z.infer<typeof CrawlWebsiteParameters>) => crawlWebsiteLogic(url, query),
});
