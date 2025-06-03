"use client"

import Image from "next/image"

export default function QuoteSection() {
  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 overflow-hidden">
      {/* Light patterned background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left Side */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              we drive innovation in ai and blockchain technology.
            </h2>
            <h3 className="text-xl md:text-2xl text-gray-600">an effective way to empower your business</h3>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200 shadow-lg"></div>
              <Image
                src="https://mzcje1drftvqhdku.public.blob.vercel-storage.com/instant-id/generated-1748571756551-instantid-1748571756550.webp"
                alt="CEO and Founder of Fantastic AI Studio, Yevhen Lukyanov"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-full"
                sizes="(min-width: 768px) 192px, 192px"
                priority
              />
            </div>
            <p className="text-sm mt-2 font-semibold text-gray-800">Yevhen Lukyanov</p>
            <p className="text-sm italic text-gray-500">ceo and founder of fantastic ai studio</p>
            <p className="text-xs italic text-gray-300">*original <a href="https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/fais-ceo-Eugene-Lukyanov-qyYzZG41iWLwtsiAgqM8MKitVwupgn.jpg" target="_blank" rel="noopener noreferrer" className="text-xs italic text-gray-300">image</a> reimagined using instant-id ai tool</p>
            <div className="mt-6 max-w-lg mx-auto">
              <p className="text-base text-gray-700">
                fantastic AI studio is the premier choice for enterprises seeking to enhance their operations with the
                latest in AI and blockchain innovations. our expertise and advanced technological solutions translate
                into tangible benefits for your business, optimizing processes and securing transactions.
              </p>

              <blockquote className="mt-6 border-l-4 border-gray-400 pl-4 italic">
                <p className="text-lg text-gray-700">
                  &quot;choosing fantastic AI studio not only ensures access to top-tier AI and blockchain development but
                  also reduces the need for extensive external resources, offering a streamlined path to digital
                  transformation.&quot;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
