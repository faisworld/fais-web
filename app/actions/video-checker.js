'use server';

/**
 * Server-side function to check if a video URL is accessible
 * @param {string} url - The URL to check
 * @returns {Promise<{ success: boolean, message: string, statusCode?: number }>}
 */
export async function checkVideoAvailability(url) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
    
    return {
      success: response.ok,
      statusCode: response.status
    };
  } catch {
    return {
      success: false,
      statusCode: 500
    };
  }
}

/**
 * Format bytes to human-readable format
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes) return 'Unknown';
  
  bytes = parseInt(bytes);
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// End of file
