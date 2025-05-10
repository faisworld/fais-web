// utils/color-mode.ts
/**
 * Utility functions for handling dark/light mode and color inversions
 */

/**
 * Determines if text should be dark or light based on background color
 * @param bgColor Background color in hex format (e.g., "#ffffff")
 * @returns "text-white" for dark backgrounds, "text-black" for light backgrounds
 */
export function getTextColorForBackground(bgColor: string): string {
  // Remove # if present
  const hex = bgColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance - modern formula for perceived brightness
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white text for dark backgrounds (luminance < 0.5)
  return luminance < 0.5 ? 'text-white' : 'text-black';
}

/**
 * Returns appropriate heading color class based on background
 * @param isDarkBg Whether the background is dark
 * @returns CSS class for heading color
 */
export function getHeadingColorClass(isDarkBg: boolean): string {
  return isDarkBg ? 'text-white' : 'text-black';
}

/**
 * Returns a collection of text color classes for use on different backgrounds
 * @param isDarkBg Whether the background is dark
 */
export function getTextColorClasses(isDarkBg: boolean): {
  heading: string;
  body: string; 
  muted: string;
} {
  return isDarkBg 
    ? {
        heading: 'text-white',
        body: 'text-gray-100',
        muted: 'text-gray-300'
      }
    : {
        heading: 'text-black',
        body: 'text-gray-800',
        muted: 'text-gray-600'
      };
}
