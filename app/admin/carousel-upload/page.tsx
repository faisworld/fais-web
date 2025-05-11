import CarouselImageUploader from "./CarouselImageUploader"

export const metadata = {
  title: "Carousel Image Upload | Admin",
  description: "Upload images for the homepage carousel",
}

export default function CarouselUploadPage() {
  return (
    <div className="container mx-auto px-4 pt-20 pb-10"> {/* Adjusted padding for consistent H1 spacing */}
      <h1 className="text-3xl font-bold mb-8">Carousel Image Upload</h1>
      <CarouselImageUploader />
    </div>
  )
}
