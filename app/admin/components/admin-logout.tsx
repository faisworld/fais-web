'use client';

import { useRouter } from 'next/navigation';

export function AdminLogout() {
  const router = useRouter();
  
  return (
    <button 
      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
      onClick={() => router.push('/')}
    >
      Back to Site
    </button>
  );
}
