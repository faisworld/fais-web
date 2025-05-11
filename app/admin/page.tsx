import Link from "next/link"
import { FiImage, FiUpload } from "react-icons/fi"

export const metadata = {
  title: "Admin Dashboard | Fantastic AI Studio",
  description: "Admin dashboard for Fantastic AI Studio",
}

export default function AdminPage() {
  const adminModules = [
    {
      title: "Carousel Image Upload",
      description: "Upload and manage images for the homepage carousel",
      icon: <FiImage size={24} />,
      href: "/admin/carousel-upload",
    },
    {
      title: "Gallery Management",
      description: "Manage images in the gallery",
      icon: <FiUpload size={24} />,
      href: "/gallery",
    },
  ]

  return (
    <div className="px-4 pt-20">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Link
            key={index}
            href={module.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">{module.icon}</div>
              <h2 className="text-xl font-semibold">{module.title}</h2>
            </div>
            <p className="text-gray-600">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
