// Quick test to check blog data structure
import { blogPosts } from './app/blog/blog-data.ts';

console.log('=== BLOG DATA TEST ===');
console.log('Total posts:', blogPosts?.length || 0);

if (blogPosts && blogPosts.length > 0) {
  console.log('\nFirst 3 posts:');
  blogPosts.slice(0, 3).forEach((post, i) => {
    console.log(`${i + 1}. ${post.title}`);
    console.log(`   Category: ${post.category}`);
    console.log(`   Date: ${post.date}`);
    console.log(`   Slug: ${post.slug}`);
    console.log('');
  });
  
  // Test filtering logic
  const allPosts = blogPosts.filter(post => {
    const matchesCategory = 'all' === 'all' || post.category === 'all';
    const matchesSearch = '' === '' || 
      post.title.toLowerCase().includes(''.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(''.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  console.log('Filtered posts (should be all):', allPosts.length);
} else {
  console.log('❌ No posts found or blog data not loaded');
}
