"use client"

import type React from "react"
import { getBlobImage } from "@/utils/image-utils"
import ClientImage from "@/components/ui/ClientImage"

// Sample testimonial data structure
const testimonials = [
  {
    id: 1,
    quote:
      "Fantastic AI Studio delivered exceptional results, exceeding our expectations with their innovative AI solutions. Their team was professional, knowledgeable, and highly responsive.",
    name: "Jane Doe",
    title: "CEO, Tech Innovators Inc.",
    imageKey: "jane-doe-avatar", // This would reference a key in blobImages
  },
  {
    id: 2,
    quote:
      "Working with Fantastic AI Studio on our blockchain project was seamless. Their expertise in smart contracts and DApps is top-notch. Highly recommended!",
    name: "John Smith",
    title: "CTO, Future Systems Ltd.",
    imageKey: "john-smith-avatar", // This would reference a key in blobImages
  },
  {
    id: 3,
    quote:
      "The insights we gained from their predictive analytics service have been invaluable to our business strategy. A truly fantastic partner.",
    name: "Alice Brown",
    title: "Marketing Director, Global Corp",
    imageKey: "alice-brown-avatar", // This would reference a key in blobImages
  },
]

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Our Clients Say</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">Hear directly from businesses that have partnered with us.</p>
        </div>

        {/* Grid layout for testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              {testimonial.imageKey && (
                <div className="mb-4 flex justify-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                    {/* Use your actual Blob storage URL for the avatar */}
                    {/* If the imageKey doesn't exist in blobImages, it will use a placeholder */}
                    <ClientImage
                      src={getBlobImage(testimonial.imageKey) || "/placeholder.svg"}
                      alt={`${testimonial.name}'s avatar`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <blockquote className="italic mb-4 flex-grow text-center">&quot;{testimonial.quote}&quot;</blockquote>

              <footer className="text-center">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.title}</p>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
