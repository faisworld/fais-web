/**
 * Safe browser API helpers
 * These functions handle APIs that might not be available during SSR
 */

/**
 * Check if code is running on the client
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Safely copy text to clipboard with fallback
 */
export function copyToClipboard(text: string): Promise<boolean> {
  if (!isClientSide() || !navigator.clipboard) {
    console.warn('Clipboard API not available');
    return Promise.resolve(false);
  }
  
  return navigator.clipboard.writeText(text)
    .then(() => true)
    .catch((err) => {
      console.error('Failed to copy text:', err);
      return false;
    });
}

/**
 * Safely open a URL in a new tab
 */
export function openInNewTab(url: string): boolean {
  if (!isClientSide()) {
    console.warn('Window API not available');
    return false;
  }
  
  try {
    const newWindow = window.open(url, '_blank');
    if (newWindow) newWindow.opener = null;
    return true;
  } catch (err) {
    console.error('Failed to open URL:', err);
    return false;
  }
}

/**
 * General placeholder URLs for development and testing
 */
export const placeholders = {
  videoUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/sample/placeholder-video.mp4",
  imageUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/sample/placeholder-image.jpg",
};
