"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FiImage, 
  FiVideo, 
  FiFileText, 
  FiUser,
  FiFilter,
  FiCpu,
  FiSearch
} from "react-icons/fi";

export default function AIToolsPage() {
  const aiTools = [
    {
      title: "AI Image Generation",
      description: "Generate high-quality images using powerful AI models like Minimax Image, Google Imagen 3, and Nvidia Sana",
      icon: <FiImage size={24} />,
      href: "/admin/ai-tools/image-generation",
      category: "image",
      color: "from-gray-500 to-gray-600"
    },
    {
      title: "AI Video Generation",
      description: "Create engaging videos using cutting-edge AI models like Google Veo 2 and Minimax Video Director",
      icon: <FiVideo size={24} />,
      href: "/admin/ai-tools/video-generation",
      category: "video",
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Instant ID",
      description: "Generate stylized portraits based on reference images with advanced AI portrait customization",
      icon: <FiUser size={24} />,
      href: "/admin/instant-id",
      category: "image",
      color: "from-rose-500 to-pink-600"
    },
    {
      title: "Article Generation",
      description: "Generate comprehensive, well-structured articles with custom topics, tone, and length options",
      icon: <FiFileText size={24} />,
      href: "/admin/ai-tools/article-generation",
      category: "text",
      color: "from-amber-500 to-orange-600"
    },    {
      title: "AI Performance Monitor",
      description: "Monitor AI model performance and resource usage",
      icon: <FiCpu size={24} />,
      href: "/admin/ai-tools/performance-monitor",
      category: "monitor",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "SEO Management",
      description: "Monitor automated SEO optimization tasks, view analysis results, and manage maintenance orchestration",
      icon: <FiSearch size={24} />,
      href: "/admin/ai-tools/seo-management",
      category: "monitor",
      color: "from-purple-500 to-violet-600"
    }
  ];

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const filteredTools = activeFilter 
    ? aiTools.filter(tool => tool.category === activeFilter) 
    : aiTools;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-700">
          AI Content Generation Tools
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create stunning images, videos, and articles with our advanced AI generation tools.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FiFilter size={18} className="text-gray-500" />
          <h2 className="text-lg font-medium text-gray-700">Filter by Media Type</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              activeFilter === null 
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setActiveFilter(null)}
          >
            All Tools
          </button>
          <button            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              activeFilter === 'image' 
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setActiveFilter('image')}
          >
            Image Tools
          </button>
          <button            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              activeFilter === 'video' 
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setActiveFilter('video')}
          >
            Video Tools
          </button>
          <button            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              activeFilter === 'text' 
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setActiveFilter('text')}
          >
            Text Tools
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredTools.map((tool, index) => (
          <Link
            key={index}
            href={tool.href}
            className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className={`h-2 w-full bg-gradient-to-r ${tool.color}`}></div>
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className={`p-4 rounded-xl mr-5 text-white bg-gradient-to-br ${tool.color}`}>
                  {tool.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{tool.title}</h2>
              </div>
              <p className="text-gray-600 mb-6">{tool.description}</p>
              <div className="mt-auto text-sm font-medium flex items-center text-gray-600 group-hover:text-gray-800 transition">
                Launch Tool
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
