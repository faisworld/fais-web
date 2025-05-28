'use client';

import MeetOurTeam from "@/components/pages/MeetOurTeam";
import ContactUs from "@/components/pages/ContactUs";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getBlobImage } from "@/utils/media-utils";

// Dynamically import the AnimatedCounter to ensure it only runs on the client
const AnimatedCounter = dynamic(() => import('@/components/ui/AnimatedCounter'), {
  ssr: false
});

export default function AboutPage() {
  return (
    // Same container style as projects page
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
      
        {/* Page Title - Same style as projects page */}
        <h1 className='text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900 text-center md:text-left lowercase'>About Fantastic AI Studio</h1>

      {/* Section: Why Choose Us - Same structure as projects */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-center mb-4 lowercase'>
          Why Choose Fantastic AI Studio?
        </h2>
        <p className='text-center text-neutral-700 mb-8 lowercase'>
          pioneering the future of technology through innovation and exceptional service in ai and blockchain solutions.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center border border-neutral-200 transform hover:-translate-y-1'>
            <h3 className='text-xl font-semibold mb-2 lowercase text-neutral-800'>innovation</h3>
            <p className='text-neutral-600 lowercase'>
              driving progress through creativity and cutting-edge technology, constantly pushing boundaries of what&apos;s possible in ai and blockchain.
            </p>
          </div>
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center border border-neutral-200 transform hover:-translate-y-1'>
            <h3 className='text-xl font-semibold mb-2 lowercase text-neutral-800'>integrity</h3>
            <p className='text-neutral-600 lowercase'>
              upholding the highest standards of honesty and ethics in every aspect of our business and client relationships.
            </p>
          </div>
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center border border-neutral-200 transform hover:-translate-y-1'>
            <h3 className='text-xl font-semibold mb-2 lowercase text-neutral-800'>collaboration</h3>
            <p className='text-neutral-600 lowercase'>
              fostering teamwork and partnerships for greater impact, recognizing that diverse perspectives lead to better solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Our Mission and Vision */}
      <section className='mb-12'>
        <h2 className='text-2xl font-bold text-center mb-4 lowercase'>
          Our Mission and Vision in AI and Blockchain
        </h2>
        <p className='text-center text-neutral-700 mb-8 lowercase'>
          to drive innovation by delivering cutting-edge ai and blockchain solutions that empower businesses to thrive in the digital age and become a global leader in transformative technologies.
        </p>
      </section>

      {/* Mission Section */}
      <section className='mb-12'>
        <h3 className='text-xl font-bold mb-4 lowercase' id='our-mission'>
          our mission
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div>
            <Image
              src={getBlobImage("about-mission-image")}
              alt="Our Mission in AI and Blockchain Innovation"
              width={700}
              height={300}
              className='rounded-lg shadow-lg'
            />
          </div>
          <div className='bg-neutral-50 p-8 rounded-lg shadow-md border border-neutral-200'>
            <h4 className='text-lg font-semibold mb-2 lowercase text-neutral-800'>innovation mission</h4>
            <p className='mb-2 text-neutral-700 lowercase'>
              to drive innovation by delivering cutting-edge ai and blockchain solutions that empower businesses to thrive in the digital age.
            </p>
            <p className='mb-2 text-neutral-700 lowercase'>
              <strong>our commitment:</strong> we are dedicated to providing secure, scalable, and efficient solutions tailored to meet the specific requirements of each business we serve.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className='mb-12'>
        <h3 className='text-xl font-bold mb-4 lowercase' id='our-vision'>
          our vision
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div>
            <Image
              src={getBlobImage("about-vision-image")}
              alt="Our Vision for AI and Blockchain Future"
              width={700}
              height={300}
              className='rounded-lg shadow-lg'
            />
          </div>
          <div className='bg-neutral-50 p-8 rounded-lg shadow-md border border-neutral-200'>
            <h4 className='text-lg font-semibold mb-2 lowercase text-neutral-800'>future vision</h4>
            <p className='mb-2 text-neutral-700 lowercase'>
              to be a global leader in ai and blockchain innovation, fostering sustainable growth and transformative technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className='mb-12'>
        <h3 className='text-xl font-bold mb-4 lowercase' id='our-values'>
          our core values
        </h3>
        <div className='bg-neutral-50 rounded-lg shadow-md p-6 border-l-4 border-neutral-400 border border-neutral-200'>
          <p className='text-neutral-700 mb-2 lowercase'>
            innovation, integrity, and collaboration are the three pillars that guide every decision we make and every solution we deliver.
          </p>
          <p className='text-neutral-700 lowercase'>
            these values ensure that we consistently provide exceptional service while maintaining the highest ethical standards in all our ai and blockchain projects.
          </p>
        </div>
      </section>

      {/* Values Cards Section */}
      <section className='mb-12'>
        <h3 className='text-xl font-bold mb-4 lowercase'>
          Our Values in Action
        </h3>
        <p className='mb-4 text-neutral-700 lowercase'>
          see how our core values translate into real-world impact across all our ai and blockchain initiatives:
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center border border-neutral-200 transform hover:-translate-y-1'>
            <Image
              src={getBlobImage("about-value-innovation-image")}
              alt='Innovation in Action'
              width={400}
              height={200}
              className='rounded mb-4 w-full h-48 object-cover'
            />
            <h4 className='text-lg font-semibold mb-2 lowercase text-neutral-800'>innovation</h4>
            <p className='text-neutral-600 mb-3 lowercase flex-grow'>driving progress through creativity and cutting-edge technology solutions.</p>
          </div>
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center border border-neutral-200 transform hover:-translate-y-1'>
            <Image
              src={getBlobImage("about-value-integrity-image")}
              alt='Integrity in Business'
              width={400}
              height={200}
              className='rounded mb-4 w-full h-48 object-cover'
            />
            <h4 className='text-lg font-semibold mb-2 lowercase text-neutral-800'>integrity</h4>
            <p className='text-neutral-600 mb-3 lowercase flex-grow'>upholding the highest standards of honesty and ethics in all relationships.</p>
          </div>
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center border border-neutral-200 transform hover:-translate-y-1'>
            <Image
              src={getBlobImage("about-value-collaboration-image")}
              alt='Collaboration and Teamwork'
              width={400}
              height={200}
              className='rounded mb-4 w-full h-48 object-cover'
            />
            <h4 className='text-lg font-semibold mb-2 lowercase text-neutral-800'>collaboration</h4>
            <p className='text-neutral-600 mb-3 lowercase flex-grow'>fostering teamwork and partnerships for greater impact and better solutions.</p>
          </div>
        </div>
      </section>
      
      {/* Stats Section - Same style as projects page */}
      <section className='py-16 bg-neutral-900 my-16 rounded-lg'>
        <div className='max-w-7xl mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12 lowercase text-white'>our achievements</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div className='bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-200'>
              <div className='text-4xl font-bold text-neutral-800 mb-3'>
                <AnimatedCounter end={82} suffix='%' duration={1800} />
              </div>
              <p className='text-neutral-600 lowercase font-medium text-sm leading-relaxed'>customer retention rate over 6 years</p>
            </div>
            <div className='bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-200'>
              <div className='text-4xl font-bold text-neutral-800 mb-3'>
                <AnimatedCounter end={100} suffix='+' duration={1200} delay={200} />
              </div>
              <p className='text-neutral-600 lowercase font-medium text-sm leading-relaxed'>clients who recommend us</p>
            </div>
            <div className='bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-200'>
              <div className='text-4xl font-bold text-neutral-800 mb-3'>
                <AnimatedCounter end={8} suffix='+' duration={1500} delay={400} />
              </div>
              <p className='text-neutral-600 lowercase font-medium text-sm leading-relaxed'>years of programming excellence</p>
            </div>
            <div className='bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-200'>
              <div className='text-4xl font-bold text-neutral-800 mb-3'>
                <AnimatedCounter end={99} suffix='%' duration={2000} delay={600} />
              </div>
              <p className='text-neutral-600 lowercase font-medium text-sm leading-relaxed'>satisfied clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <MeetOurTeam />

      {/* Contact Us Section */}
      <section className='mb-12'>
        <h3 className='text-xl font-bold mb-4 lowercase'>
          get in touch
        </h3>
        <div className='bg-neutral-50 rounded-lg shadow-md p-6 border-l-4 border-neutral-400 border border-neutral-200'>
          <ContactUs />
        </div>
      </section>
    </div>
  );
}