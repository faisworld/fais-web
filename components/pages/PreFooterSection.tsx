"use client";

export default function PreFooterSection() {
  return (
    <section className="px-4 py-16 bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        {/* Heading */}
        <h2 className="text-3xl font-bold">
          The best way out for your business. Let's work together!
        </h2>

        {/* Subheading */}
        <p className="text-lg">
          Today, the businesses which do not benefit from the latest innovations in technologies,
          <br />
          <span className="font-bold">Tomorrow will go obsolete!</span>
        </p>

        {/* Button */}
        <div>
          <a
            href="https://fais.world/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-100"
          >
            Contact Us Today... <span className="font-bold">for Tomorrow's Success!</span>
          </a>
        </div>
      </div>
    </section>
  );
}