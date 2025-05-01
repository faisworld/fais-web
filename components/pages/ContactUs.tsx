"use client"

import { getBlobImage } from "@/utils/image-utils"

export default function ContactUs() {
  // You can either use an inline style with the blob URL
  // or add the background image via a className in CSS
  const backgroundStyle = {
    backgroundImage: `url(${getBlobImage("contact-background")})`,
  }

  return (
    <section
      className="contact-section flex flex-col items-center text-center py-16 px-6 bg-cover bg-center"
      style={backgroundStyle}
    >
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg mb-6">Office: Ukraine, 132 Velyka Vasylkivska Str. Off. 13, Kyiv, 03150</p>
        <button className="custom-button">Contact Us Now</button>
      </div>
    </section>
  )
}
