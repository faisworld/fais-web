/**
 * Script to move specific article images to the correct article-images folder
 * and update the blog data with the new URLs
 */

const imageUrls = [
  'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/selected-premium-smart-contracts-in-real-estate-google-imagen-4-1749819384637.jpg',
  'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/selected-premium-nft-marketplaces-and-digital-ownership-google-imagen-4-1749819381730.jpg',
  'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/selected-premium-decentralized-finance-defi-latest-developments-black-forest-labs-flux-1-1-pro-1749819387733.jpg'
];

async function moveArticleImages() {
  try {
    const response = await fetch('/api/admin/gallery/move-article-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrls }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to move images');
    }

    console.log('Image move results:', result);
    return result.results;
    
  } catch (error) {
    console.error('Error moving images:', error);
    throw error;
  }
}

// Export for use in other scripts
export { moveArticleImages, imageUrls };
