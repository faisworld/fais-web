"use client"

export default function ContactUs() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg inline-block">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg mb-6">Office: Ukraine, 132 Velyka Vasylkivska Str. Off. 13, Kyiv, 03150</p>
          <button className="custom-button bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 hover:from-yellow-400 hover:via-pink-500 hover:to-blue-500 text-white px-8 py-4 rounded-md shadow-lg font-bold transition-all duration-300 hover:scale-105">
            Contact Us Now
          </button>
        </div>
      </div>
    </section>
  )
}
