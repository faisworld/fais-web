"use client"

export default function PreFooterSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center space-y-6">        {/* Heading */}
        <h2 className="text-3xl font-bold">the best way out for your business. let&apos;s work together!</h2>

        {/* Subheading */}
        <p className="text-lg max-w-3xl mx-auto">
          today, the businesses which do not benefit from the latest innovations in technologies,
          <br />
          <span className="font-bold">tomorrow will go obsolete!</span>
        </p>        {/* Button */}
        <div className="mt-8">
          <a
            href="https://fais.world/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn cta-animated-btn inline-block px-8 py-4 font-bold rounded-md shadow-lg text-lg transition-all duration-300 bg-black text-white hover:bg-black hover:text-white hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-600"
            style={{ color: 'white' }} /* Додаємо інлайн-стиль для примусового білого тексту */
            onMouseEnter={(e) => (e.currentTarget.textContent = "for tomorrow's success!")}
            onMouseLeave={(e) => (e.currentTarget.textContent = "contact us today...")}
          >
            contact us today...
          </a>
        </div>
      </div>
    </section>
  )
}
