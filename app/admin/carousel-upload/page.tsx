import CarouselImageUploader from "./CarouselImageUploader"

export const metadata = {
  title: "Carousel Image Upload | Admin",
  description: "Upload images for the homepage carousel",
}

export default function CarouselUploadPage() {
  return (
    <div className="container mx-auto py-10 px-4 mt-20">
      <h1 className="text-3xl font-bold mb-8">Carousel Image Upload</h1>
      <CarouselImageUploader />
    </div>
  )
}
