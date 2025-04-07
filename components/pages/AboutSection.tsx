// filepath: c:\Users\solar\Projects\fais-web\components\pages\AboutSection.tsx
"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center px-4 py-16 bg-gray-50">
      {/* Left Column: Image */}
      <div className="flex justify-center">
        <Image
          src="/images/team-of-professionals.webp"
          alt="Artificial Intelligence and Blockchain Integration"
          width={500} // Set the desired width
          height={800} // Set the desired height
          className="rounded-lg shadow-lg"
          priority // Ensures the image is preloaded
        />
      </div>

      {/* Right Column: Content */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">
          We are a team of professionals!
        </h2>
        <p className="text-gray-600">
          Fantastic AI Studio stands out for its commitment to innovation,
          security, and seamless integration, ensuring your projects are
          future-proof and scalable.
        </p>

        {/* Icon Boxes */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              40+ Projects Ready
            </h3>
            <p className="text-gray-600">
              Numerous satisfied clients around the world. Big and small
              projects realized.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Comprehensive AI Solutions
            </h3>
            <p className="text-gray-600">
              Harness the power of artificial intelligence to optimize your
              operations, enhance decision-making, and create intelligent
              systems that learn and adapt.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Secure Blockchain Integration
            </h3>
            <p className="text-gray-600">
              Secure and transparent blockchain applications custom-designed to
              streamline your business processes and ensure integrity in every
              transaction.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Advanced Data Analytics
            </h3>
            <p className="text-gray-600">
              Our services include data mining, predictive modeling, and
              interactive visualization, enabling informed decisions and
              business growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}