import { notFound } from "next/navigation"
import ImageEditClient from "./ImageEditClient"

// This is a Server Component that fetches data server-side
export default async function GalleryImageEditPage({ params }: { params: { id: string } }) {
  const id = params.id

  try {
    // Use the absolute URL to avoid URL parsing issues
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
    const host = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "localhost:3000" : "")

    // Construct a valid URL ensuring no double slashes
    const apiUrl = `${protocol}://${host.replace(/^https?:\/\//, "")}/api/gallery/images?id=${encodeURIComponent(id)}`

    console.log(`Fetching image with ID ${id} from: ${apiUrl}`)

    const res = await fetch(apiUrl, {
      cache: "no-store", // Don't cache this request
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 }, // Ensure fresh data
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Error fetching image: ${res.status}. Response: ${errorText}`)
      throw new Error(`Failed to fetch image: ${res.status}`)
    }

    const data = await res.json()
    const img = data.image

    if (!img) {
      console.error("No image found in response")
      notFound()
    }

    console.log("Image data received:", img)

    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Edit Image</h1>
        <ImageEditClient img={img} alt={img.altTag || img["alt-tag"] || img.title || ""} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching image:", error)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Edit Image</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-medium text-red-600 mb-4">Error loading image</h2>
          <p className="text-gray-700 mb-4">
            We couldn't find the image you're looking for. It may have been deleted or the ID might be incorrect.
          </p>
          <p className="text-gray-700 mb-4">Error details: {error instanceof Error ? error.message : String(error)}</p>
          <a href="/gallery" className="btn">
            Return to Gallery
          </a>
        </div>
      </div>
    )
  }
}
