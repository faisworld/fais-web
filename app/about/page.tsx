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
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
      
      {/* Hero Section with centered title */}
      <section className='text-center mb-20'>
        <h1 className='text-5xl md:text-7xl font-extrabold mb-8 text-neutral-900 lowercase leading-tight'>
          about fantastic ai studio
        </h1>
        <div className='max-w-4xl mx-auto'>
          <p className='text-xl md:text-2xl text-neutral-600 mb-12 leading-relaxed lowercase'>
            we are a pioneering technology company dedicated to transforming businesses through the power of artificial intelligence and blockchain innovation.
          </p>
          <div className='w-24 h-1 bg-neutral-800 mx-auto mb-16'></div>
        </div>
      </section>

      {/* Story Timeline Section */}
      <section className='mb-20'>
        <h2 className='text-4xl font-bold text-center mb-16 lowercase text-neutral-800'>
          our story
        </h2>
        <div className='relative'>
          {/* Vertical Timeline Line */}
          <div className='absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-neutral-300 hidden md:block'></div>
          
          {/* Timeline Item 1 - Mission */}
          <div className='relative mb-16'>
            <div className='md:flex md:items-center'>
              <div className='md:w-1/2 md:pr-12 mb-8 md:mb-0'>
                <div className='bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 rounded-2xl shadow-lg border border-neutral-200'>
                  <h3 className='text-2xl font-bold mb-4 lowercase text-neutral-800'>our mission</h3>
                  <p className='text-neutral-600 leading-relaxed lowercase'>
                    to drive innovation by delivering cutting-edge ai and blockchain solutions that empower businesses to thrive in the digital age. we believe technology should be accessible, transformative, and ethically implemented.
                  </p>
                </div>
              </div>
              <div className='md:w-1/2 md:pl-12'>
                <Image
                  src={getBlobImage("about-mission-image")}
                  alt="Our Mission in AI and Blockchain Innovation"
                  width={600}
                  height={400}
                  className='rounded-2xl shadow-xl w-full object-cover'
                />
              </div>
            </div>
            {/* Timeline Dot */}
            <div className='absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-neutral-800 rounded-full border-4 border-white shadow-lg hidden md:block' style={{top: '50%'}}></div>
          </div>

          {/* Timeline Item 2 - Vision */}
          <div className='relative mb-16'>
            <div className='md:flex md:items-center md:flex-row-reverse'>
              <div className='md:w-1/2 md:pl-12 mb-8 md:mb-0'>
                <div className='bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 rounded-2xl shadow-lg border border-neutral-200'>
                  <h3 className='text-2xl font-bold mb-4 lowercase text-neutral-800'>our vision</h3>
                  <p className='text-neutral-600 leading-relaxed lowercase'>
                    to be a global leader in ai and blockchain innovation, fostering sustainable growth and transformative technologies that shape the future of how businesses operate and connect.
                  </p>
                </div>
              </div>
              <div className='md:w-1/2 md:pr-12'>
                <Image
                  src={getBlobImage("about-vision-image")}
                  alt="Our Vision for AI and Blockchain Future"
                  width={600}
                  height={400}
                  className='rounded-2xl shadow-xl w-full object-cover'
                />
              </div>
            </div>
            {/* Timeline Dot */}
            <div className='absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-neutral-800 rounded-full border-4 border-white shadow-lg hidden md:block' style={{top: '50%'}}></div>
          </div>
        </div>
      </section>

      {/* Core Values Section - Horizontal Layout */}
      <section className='mb-20'>
        <h2 className='text-4xl font-bold text-center mb-4 lowercase text-neutral-800'>
          our core values
        </h2>
        <p className='text-center text-neutral-600 mb-16 text-lg lowercase max-w-3xl mx-auto'>
          three fundamental principles guide everything we do, ensuring we deliver exceptional value while maintaining the highest ethical standards.
        </p>
        
        <div className='space-y-12'>
          {/* Innovation Value */}
          <div className='flex flex-col lg:flex-row items-center gap-12'>
            <div className='lg:w-1/3'>
              <Image
                src={getBlobImage("about-value-innovation-image")}
                alt='Innovation in Action'
                width={400}
                height={300}
                className='rounded-2xl shadow-lg w-full object-cover'
              />
            </div>
            <div className='lg:w-2/3'>
              <div className='bg-white p-8 rounded-2xl shadow-lg border border-neutral-200 h-full'>
                <h3 className='text-3xl font-bold mb-4 lowercase text-neutral-800'>innovation</h3>
                <p className='text-neutral-600 text-lg leading-relaxed lowercase'>
                  driving progress through creativity and cutting-edge technology, constantly pushing boundaries of what&apos;s possible in ai and blockchain. we embrace experimentation and continuous learning to stay at the forefront of technological advancement.
                </p>
              </div>
            </div>
          </div>

          {/* Integrity Value */}
          <div className='flex flex-col lg:flex-row-reverse items-center gap-12'>
            <div className='lg:w-1/3'>
              <Image
                src={getBlobImage("about-value-integrity-image")}
                alt='Integrity in Business'
                width={400}
                height={300}
                className='rounded-2xl shadow-lg w-full object-cover'
              />
            </div>
            <div className='lg:w-2/3'>
              <div className='bg-white p-8 rounded-2xl shadow-lg border border-neutral-200 h-full'>
                <h3 className='text-3xl font-bold mb-4 lowercase text-neutral-800'>integrity</h3>
                <p className='text-neutral-600 text-lg leading-relaxed lowercase'>
                  upholding the highest standards of honesty and ethics in every aspect of our business and client relationships. transparency, accountability, and trust form the foundation of every partnership we build.
                </p>
              </div>
            </div>
          </div>

          {/* Collaboration Value */}
          <div className='flex flex-col lg:flex-row items-center gap-12'>
            <div className='lg:w-1/3'>
              <Image
                src={getBlobImage("about-value-collaboration-image")}
                alt='Collaboration and Teamwork'
                width={400}
                height={300}
                className='rounded-2xl shadow-lg w-full object-cover'
              />
            </div>
            <div className='lg:w-2/3'>
              <div className='bg-white p-8 rounded-2xl shadow-lg border border-neutral-200 h-full'>
                <h3 className='text-3xl font-bold mb-4 lowercase text-neutral-800'>collaboration</h3>
                <p className='text-neutral-600 text-lg leading-relaxed lowercase'>
                  fostering teamwork and partnerships for greater impact, recognizing that diverse perspectives lead to better solutions. we believe in the power of collective intelligence and shared expertise.
                </p>
              </div>
            </div>          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Circular Stats Layout */}
      <section className='mb-20'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold mb-6 lowercase text-neutral-800'>
            why choose fantastic ai studio?
          </h2>
          <p className='text-neutral-600 text-lg lowercase max-w-3xl mx-auto'>
            our track record speaks for itself. we combine technical excellence with business understanding to deliver solutions that make a real impact.
          </p>
        </div>
        
        {/* Circular Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16'>
          <div className='text-center'>
            <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center shadow-lg border border-neutral-200'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-neutral-800'>
                  <AnimatedCounter end={82} suffix='%' duration={1800} />
                </div>
                <p className='text-xs text-neutral-600 lowercase'>retention</p>
              </div>
            </div>
            <h3 className='text-lg font-semibold mb-2 lowercase text-neutral-800'>customer loyalty</h3>
            <p className='text-neutral-600 text-sm lowercase'>82% customer retention rate over 6 years</p>
          </div>
          
          <div className='text-center'>
            <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center shadow-lg border border-neutral-200'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-neutral-800'>
                  <AnimatedCounter end={100} suffix='+' duration={1200} delay={200} />
                </div>
                <p className='text-xs text-neutral-600 lowercase'>clients</p>
              </div>
            </div>
            <h3 className='text-lg font-semibold mb-2 lowercase text-neutral-800'>referrals</h3>
            <p className='text-neutral-600 text-sm lowercase'>100+ clients who recommend us</p>
          </div>
          
          <div className='text-center'>
            <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center shadow-lg border border-neutral-200'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-neutral-800'>
                  <AnimatedCounter end={8} suffix='+' duration={1500} delay={400} />
                </div>
                <p className='text-xs text-neutral-600 lowercase'>years</p>
              </div>
            </div>
            <h3 className='text-lg font-semibold mb-2 lowercase text-neutral-800'>experience</h3>
            <p className='text-neutral-600 text-sm lowercase'>8+ years of programming excellence</p>
          </div>
          
          <div className='text-center'>
            <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center shadow-lg border border-neutral-200'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-neutral-800'>
                  <AnimatedCounter end={99} suffix='%' duration={2000} delay={600} />
                </div>
                <p className='text-xs text-neutral-600 lowercase'>satisfied</p>
              </div>
            </div>
            <h3 className='text-lg font-semibold mb-2 lowercase text-neutral-800'>satisfaction</h3>
            <p className='text-neutral-600 text-sm lowercase'>99% client satisfaction rate</p>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className='mb-20'>
        <div className='bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-3xl p-12 border border-neutral-200 shadow-xl'>
          <h2 className='text-4xl font-bold text-center mb-12 lowercase text-neutral-800'>
            what sets us apart
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-3 h-3 bg-neutral-800 rounded-full mt-2 flex-shrink-0'></div>
                <div>
                  <h3 className='text-xl font-semibold mb-2 lowercase text-neutral-800'>deep technical expertise</h3>
                  <p className='text-neutral-600 lowercase'>our team combines years of experience in ai, machine learning, and blockchain development with cutting-edge research and industry best practices.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-3 h-3 bg-neutral-800 rounded-full mt-2 flex-shrink-0'></div>
                <div>
                  <h3 className='text-xl font-semibold mb-2 lowercase text-neutral-800'>business-first approach</h3>
                  <p className='text-neutral-600 lowercase'>we don&apos;t just build technology for technology&apos;s sake. every solution is designed to solve real business problems and deliver measurable value.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-3 h-3 bg-neutral-800 rounded-full mt-2 flex-shrink-0'></div>
                <div>
                  <h3 className='text-xl font-semibold mb-2 lowercase text-neutral-800'>end-to-end solutions</h3>
                  <p className='text-neutral-600 lowercase'>from initial concept to deployment and ongoing support, we provide comprehensive solutions that scale with your business needs.</p>
                </div>
              </div>
            </div>
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-3 h-3 bg-neutral-800 rounded-full mt-2 flex-shrink-0'></div>
                <div>
                  <h3 className='text-xl font-semibold mb-2 lowercase text-neutral-800'>transparent communication</h3>
                  <p className='text-neutral-600 lowercase'>we believe in clear, honest communication throughout every project, keeping you informed and involved at every step of the development process.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-3 h-3 bg-neutral-800 rounded-full mt-2 flex-shrink-0'></div>
                <div>
                  <h3 className='text-xl font-semibold mb-2 lowercase text-neutral-800'>future-proof technology</h3>
                  <p className='text-neutral-600 lowercase'>our solutions are built with scalability and longevity in mind, ensuring your investment continues to deliver value as technology evolves.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-3 h-3 bg-neutral-800 rounded-full mt-2 flex-shrink-0'></div>
                <div>
                  <h3 className='text-xl font-semibold mb-2 lowercase text-neutral-800'>ongoing partnership</h3>
                  <p className='text-neutral-600 lowercase'>we don&apos;t just deliver and disappear. we build long-term partnerships, providing continuous support and evolution of your solutions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <MeetOurTeam />

      {/* Contact Section */}
      <section className='mb-12'>
        <div className='bg-white rounded-3xl p-12 shadow-xl border border-neutral-200'>
          <h3 className='text-3xl font-bold text-center mb-8 lowercase text-neutral-800'>
            ready to start your journey?
          </h3>
          <p className='text-center text-neutral-600 mb-8 text-lg lowercase max-w-2xl mx-auto'>
            let&apos;s discuss how we can help transform your business with innovative ai and blockchain solutions.
          </p>
          <ContactUs />
        </div>
      </section>
    </div>
  );
}