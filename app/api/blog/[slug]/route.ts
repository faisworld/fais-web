import { NextResponse } from 'next/server';
import pg from 'pg';

const { Client } = pg;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }
    
    // Connect to database
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    
    // Fetch specific article from database
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
      WHERE slug = $1
    `, [slug]);
    
    await client.end();
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    const row = result.rows[0];
    
    // Transform database article to match BlogPost interface
    const article = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      content: row.content,
      excerpt: row.content?.substring(0, 200) + '...' || '',
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
    };
    
    return NextResponse.json({ article });
    
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch article'
    }, { status: 500 });
  }
}
