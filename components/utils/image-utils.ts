/**
 * Add function to update carousel media metadata in DB via API
 * @param updatedMedia Array of media objects with metadata to update
 * @returns Response from the API
 */
export async function updateCarouselMediaMetadata(updatedMedia: Array<{ key: string; url: string; keywords?: string; link?: string }>) {
  try {
    const response = await fetch('/api/admin/carousel/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updatedMedia }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update carousel metadata');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to update carousel metadata:', error);
    throw error;
  }
}