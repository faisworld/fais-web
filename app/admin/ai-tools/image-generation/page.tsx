'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ImageGenerationPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/admin/ai-tools');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to AI Tools...</p>
      </div>
    </div>
  );
}