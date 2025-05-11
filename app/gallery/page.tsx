import GalleryClient from "./GalleryClient"

export const metadata = {
  title: "Image Gallery | Fantastic AI Studio",
  description: "Browse and manage your image gallery",
}

export default async function GalleryPage() {
  // You could fetch initial photos here if needed
  return (
    <div className="container mx-auto px-4 pt-20 pb-10">
      <h1 className="text-3xl font-bold mb-8">Image Gallery</h1>
      <GalleryClient />
    </div>
  )
}
