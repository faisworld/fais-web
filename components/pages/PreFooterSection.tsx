"use client"

export default function PreFooterSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        {/* Heading */}
        <h2 className="text-3xl font-bold">The best way out for your business. Let&apos;s work together!</h2>

        {/* Subheading */}
        <p className="text-lg max-w-3xl mx-auto">
          Today, the businesses which do not benefit from the latest innovations in technologies,
          <br />
          <span className="font-bold">Tomorrow will go obsolete!</span>
        </p>

        {/* Button */}
        <div className="mt-8">
          <a
            href="https://fais.world/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-animated-btn inline-block px-8 py-4 font-bold rounded-md shadow-lg text-lg transition-all duration-300 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-white hover:from-yellow-400 hover:via-pink-500 hover:to-blue-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onMouseEnter={(e) => (e.currentTarget.textContent = "Contact Us Today...")}
            onMouseLeave={(e) => (e.currentTarget.textContent = "for Tomorrow's Success!")}
          >
            Contact Us Today...
          </a>
        </div>
      </div>
    </section>
  )
}
