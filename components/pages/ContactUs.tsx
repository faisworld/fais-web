"use client"

export default function ContactUs() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg inline-block">
          <h2 className="text-3xl font-bold mb-4 lowercase">contact us</h2>
          <p className="text-lg mb-6 lowercase">office: ukraine, 132 velyka vasylkivska str. off. 13, kyiv, 03150</p>
          <button className="btn inline-block px-8 py-3 bg-black text-white hover:bg-neutral-700 transition-colors duration-300 rounded-md shadow-lg font-medium lowercase">
            contact us now
          </button>
        </div>
      </div>
    </section>
  )
}
