"use client";

import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center px-4 py-16">
      {/* Left Column: Image */}
      <div className="flex justify-center">
        <Image
          src="/images/about-placeholder.png"
          alt="About Placeholder"
          width={400}
          height={300}
          className="mx-auto"
          sizes="(max-width: 768px) 100vw, 400px"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Right Column: Content */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">
          We are a team of professionals!
        </h2>
        <p>
          Fantastic AI Studio stands out for its commitment to innovation,
          security, and seamless integration, ensuring your projects are
          future-proof and scalable.
        </p>

        {/* Icon Boxes */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">
              40+ Projects Ready
            </h3>
            <p>
              Numerous satisfied clients around the world. Big and small
              projects realized.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              Comprehensive AI Solutions
            </h3>
            <p>
              Harness the power of artificial intelligence to optimize your
              operations, enhance decision-making, and create intelligent
              systems that learn and adapt.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              Secure Blockchain Integration
            </h3>
            <p>
              Secure and transparent blockchain applications custom-designed to
              streamline your business processes and ensure integrity in every
              transaction.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              Advanced Data Analytics
            </h3>
            <p>
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