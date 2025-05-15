import Link from "next/link"
import { 
  FiImage, FiUpload, FiUser, FiFolder, FiVideo, 
  FiFileText, FiCpu, FiBox, FiDatabase, FiServer 
} from "react-icons/fi"

export const metadata = {
  title: "Admin Dashboard | Fantastic AI Studio",
  description: "Admin dashboard for Fantastic AI Studio",
}

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
      color: "from-blue-500 to-blue-600"
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
  ];

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
      title: "Carousel Upload",
      description: "Upload and manage images for the homepage carousel",
      icon: <FiImage size={24} />,
      href: "/admin/carousel-upload",
      color: "from-fuchsia-500 to-purple-600"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
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
                <p className="text-gray-600">{tool.description}</p>
                <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-indigo-600 flex items-center transition-colors">
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

      <div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 flex items-center justify-center text-white">
            <FiDatabase size={20} />
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
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full mr-4 text-white bg-gradient-to-br ${tool.color}`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold">{tool.title}</h3>
                </div>
                <p className="text-gray-600">{tool.description}</p>
                <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-indigo-600 flex items-center transition-colors">
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
    </div>
  )
}
