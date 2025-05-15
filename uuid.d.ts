// This file provides missing type declarations for 'uuid' package
// and helps avoid direct access to properties like contentType.

declare module 'uuid' {
  export function v4(): string;
  // Add other uuid exports if needed
}

// Usage note:
// In your code, cast uuid imports or objects to 'any' if you need to access
// properties like contentType to avoid TypeScript errors.
