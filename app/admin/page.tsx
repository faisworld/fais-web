"use client";

import Link from "next/link"
import { 
  FiImage, FiUpload, FiUser, FiFolder, FiVideo, 
  FiFileText, FiCpu, FiMonitor, FiSettings, FiActivity
} from "react-icons/fi"
import { AdminHeader } from "./components/admin-header"

export default function AdminPage() {
  const aiTools = [
    {
      title: "AI Tools Dashboard",
      description: "Access all AI generation tools in one place",
      icon: <FiCpu size={24} />,
      href: "/admin/ai-tools",
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "Image Generation",
      description: "Generate images with various AI models",
      icon: <FiImage size={24} />,
      href: "/admin/ai-tools/image-generation",
      color: "from-gray-500 to-gray-600"
    },
    {
      title: "Video Generation",
      description: "Create videos using AI models",
      icon: <FiVideo size={24} />,
      href: "/admin/ai-tools/video-generation",
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Article Generation",
      description: "Generate blog articles and content",
      icon: <FiFileText size={24} />,
      href: "/admin/ai-tools/article-generation",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Instant ID Tool",
      description: "Generate AI images of people in different styles",
      icon: <FiUser size={24} />,
      href: "/admin/instant-id",
      color: "from-rose-500 to-pink-600"
    },
  ]
  
  const contentTools = [
    {
      title: "Gallery Management",
      description: "Manage images in the gallery database",
      icon: <FiFolder size={24} />,
      href: "/admin/gallery",
      color: "from-sky-500 to-cyan-600"
    },
    {
      title: "Upload New Image",
      description: "Upload a new image to the gallery",
      icon: <FiUpload size={24} />,
      href: "/admin/gallery/upload",
      color: "from-emerald-500 to-green-600"
    },
    {
      title: "Video Quality Monitor",
      description: "Analyze and monitor carousel video quality",
      icon: <FiMonitor size={24} />,
      href: "/admin/video-quality",
      color: "from-purple-500 to-violet-600"
    }
  ]

  const systemTools = [
    {
      title: "Maintenance Dashboard",
      description: "Monitor automated maintenance jobs and system health",
      icon: <FiActivity size={24} />,
      href: "/admin/maintenance-dashboard",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "AI Tools Dashboard",
      description: "Monitor AI tools performance and SEO optimization",
      icon: <FiSettings size={24} />,
      href: "/admin/ai-tools",
      color: "from-indigo-500 to-purple-600"
    }
  ]

  return (
    <>
      <AdminHeader title="Admin Dashboard" />
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-700">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your content and utilize advanced AI tools to create engaging media for your website.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <FiCpu size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI Content Generation</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full mr-4 text-white bg-gradient-to-br ${tool.color}`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-xl font-bold">{tool.title}</h3>
                  </div>
                  <p className="text-gray-600">{tool.description}</p>                  <div className="mt-4 text-sm font-medium text-gray-600 group-hover:text-gray-800 flex items-center transition-colors">
                    Open Tool
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 flex items-center justify-center text-white">
              <FiFolder size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTools.map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <FiActivity size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">System Management</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemTools.map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
