"use client"

import { AdminHeader } from "../components/admin-header"

export default function AdminCarousel() {
  return (
    <>
      <AdminHeader title="Carousel Management" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Carousel Management</h1>
          <p className="text-gray-600 mb-6">
            Upload and manage carousel images and content for the homepage.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Carousel Upload</h3>
            <p className="mt-2 text-gray-500">
              Use the carousel upload tool to manage homepage carousel content.
            </p>
            <div className="mt-6">
              <a 
                href="/admin/carousel-upload" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Carousel Upload
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
