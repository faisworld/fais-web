import MissingImageFixer from "@/components/ui/MissingImageFixer"

export const metadata = {
  title: "Image Fixer | Fantastic AI Studio",
  description: "Fix missing images on the website",
}

export default function ImageFixerPage() {
  return (
    <div className="container mx-auto py-10 px-4 mt-20">
      <h1 className="text-3xl font-bold mb-8">Image Fixer Tool</h1>
      <p className="mb-6">
        This tool helps you fix missing images on the website. Click the floating button in the bottom right corner to
        open the image fixer.
      </p>
      <MissingImageFixer />
    </div>
  )
}
