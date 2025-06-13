"use client"

import { AdminHeader } from "../components/admin-header"

export default function AdminTools() {
  return (
    <>
      <AdminHeader title="Admin Tools" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Tools</h1>
          <p className="text-gray-600 mb-6">
            Access all available admin tools and utilities for managing the FAIS website.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Tools</h3>
            <p className="text-gray-500 mb-6">
              Use the AI Tools section for advanced content management and generation.
            </p>
            <div className="flex justify-center">
              <a 
                href="/admin/ai-tools" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to AI Tools
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
