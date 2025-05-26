"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Simplified AdminClientLayout without auth checks
export function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button 
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => router.push('/')}
          >
            Back to Site
          </button>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
