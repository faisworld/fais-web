import { NextResponse } from 'next/server';
import pg from 'pg';

const { Client } = pg;

export async function GET() {
  try {
    // Connect to database
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    
    // Fetch all articles from database
    const result = await client.query(`
      SELECT 
        id,
        slug,
        title,
        content,
        date,
        read_time,
        category,
        cover_image_url as "coverImage",
        featured,
        author,
        author_image as "authorImage",
        created_at,
        updated_at
      FROM blog_articles 
      ORDER BY created_at DESC
    `);
    
    await client.end();
    
    // Transform database articles to match BlogPost interface
    const articles = result.rows.map(row => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.content?.substring(0, 200) + '...' || '', // Create excerpt from content
      date: new Date(row.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      readTime: row.read_time || '5 min read',
      category: row.category || 'ai',
      coverImage: row.coverImage || '',
      featured: row.featured || false,
      author: row.author || 'Fantastic AI',
      authorImage: row.authorImage || 'author-fantastic'
    }));
    
    return NextResponse.json({ 
      articles,
      count: articles.length 
    });
    
  } catch (error) {
    console.error('Error fetching database articles:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch articles',
      articles: [],
      count: 0 
    }, { status: 500 });
  }
}
