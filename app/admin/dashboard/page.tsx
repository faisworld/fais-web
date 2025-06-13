"use client"

import { AdminHeader } from "../components/admin-header"

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader title="Admin Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Welcome to the FAIS admin dashboard. Select from the available tools and sections below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gallery Management */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Gallery Management</h3>
            <p className="text-gray-600 mb-4">Manage media files, images, and gallery content.</p>
            <a href="/admin/gallery" className="btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Open Gallery
            </a>
          </div>

          {/* AI Tools */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">AI Tools</h3>
            <p className="text-gray-600 mb-4">Access AI-powered content generation and management tools.</p>
            <a href="/admin/ai-tools" className="btn bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Open AI Tools
            </a>
          </div>

          {/* Carousel Management */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Carousel</h3>
            <p className="text-gray-600 mb-4">Upload and manage carousel images and content.</p>
            <a href="/admin/carousel-upload" className="btn bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Manage Carousel
            </a>
          </div>

          {/* Maintenance Dashboard */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Maintenance</h3>
            <p className="text-gray-600 mb-4">System maintenance and monitoring tools.</p>
            <a href="/admin/maintenance-dashboard" className="btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Open Maintenance
            </a>
          </div>

          {/* Media Generation */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Media Generation</h3>
            <p className="text-gray-600 mb-4">Advanced media generation and processing tools.</p>
            <a href="/admin/media-generation" className="btn bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Open Media Tools
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
