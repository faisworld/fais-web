import Link from 'next/link';
import ImageEditClient from "./ImageEditClient";

// This is a Server Component that fetches data server-side
export default async function GalleryImageEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    // Use relative URL for same-origin requests to avoid port issues
    const apiUrl = `/api/gallery/images?id=${encodeURIComponent(id)}`

    console.log(`Fetching image with ID ${id} from: ${apiUrl}`)

    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const img = data.image

    if (!img) {
      throw new Error("Image data not found in response")
    }

    console.log("Image data received:", img)

    return (
      <div className="container mx-auto px-4 pt-20 pb-10"> {/* Ensured pt-20 */}
        <h1 className="text-3xl font-bold mb-8">Edit Image: {img.title || `Image ID: ${id}`}</h1>
        <ImageEditClient img={img} alt={img.title || "Edit Image"} /> {/* Corrected component usage and added alt prop */}
      </div>
    )
  } catch (error) {
    console.error("Error fetching image:", error)
    return (
      <div className="container mx-auto px-4 pt-20 pb-10 text-center"> {/* Ensured pt-20 */}
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Image</h1>
        <p className="mb-4">We couldn&apos;t find the image you&apos;re looking for. It may have been deleted or the ID might be incorrect.</p>
        <Link href="/gallery" className="btn bg-black text-white hover:bg-gray-800 px-4 py-2 rounded">
          Back to Gallery
        </Link>
      </div>
    )
  }
}
