'use client';

import MeetOurTeam from "@/components/pages/MeetOurTeam";
import ContactUs from "@/components/pages/ContactUs";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getBlobImage } from "@/utils/image-utils";

// Dynamically import the AnimatedCounter to ensure it only runs on the client
const AnimatedCounter = dynamic(() => import('../../components/ui/AnimatedCounter'), {
  ssr: false
});

export default function AboutPage() {
    return (
        <div className="bg-white">
            <main>                {/* Hero Section */}
                <section className="relative py-24 lg:py-32 mb-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-neutral-100 z-0"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f5f5f5,transparent_70%)]"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-block relative mb-8">
                                <div className="absolute -inset-4 bg-white rounded-lg shadow-[0_10px_40px_-25px_rgba(0,0,0,0.2)] -z-10 transform -rotate-1"></div>
                                <h1 className="text-5xl md:text-7xl font-extrabold lowercase text-neutral-800 transform rotate-1">
                                    about fantastic ai studio
                                </h1>
                            </div>
                            <p className="text-xl text-neutral-600">
                                Pioneering the future of technology through innovation and exceptional service
                            </p>
                        </div>
                    </div>
                </section>

                {/* Main content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      {/* Mission Section */}
                    <section className="mb-32">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div className="order-2 md:order-1">
                                <div className="relative inline-block mb-6">
                                    <span className="absolute -inset-1 bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-md -z-10"></span>
                                    <h2 className="text-4xl font-bold lowercase text-neutral-800 relative">
                                        our mission
                                        <span className="absolute -bottom-2 left-0 w-16 h-[2px] bg-gradient-to-r from-neutral-400 to-neutral-200"></span>
                                    </h2>
                                </div>
                                <p className="text-lg text-neutral-600 leading-relaxed">
                                    To drive innovation by delivering cutting-edge AI and blockchain solutions that empower businesses to thrive in the digital age.
                                </p>
                            </div>
                            <div className="order-1 md:order-2">
                                <div className="overflow-hidden rounded-md relative group transition-all duration-500" 
                                     style={{ boxShadow: "0 20px 40px -20px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)" }}>
                                    <div className="absolute inset-0 border border-neutral-100 rounded-md z-10 pointer-events-none transform group-hover:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <Image
                                        src={getBlobImage("about-mission-image")}
                                        alt="Our Mission"
                                        width={600}
                                        height={360}
                                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Vision Section */}
                    <section className="mb-32">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div className="order-1">
                                <div className="overflow-hidden rounded-md relative group transition-all duration-500" 
                                     style={{ boxShadow: "0 20px 40px -20px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)" }}>
                                    <div className="absolute inset-0 border border-neutral-100 rounded-md z-10 pointer-events-none transform group-hover:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <Image
                                        src={getBlobImage("about-vision-image")}
                                        alt="Our Vision"
                                        width={600}
                                        height={360}
                                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                            <div className="order-2">
                                <div className="relative inline-block mb-6">
                                    <span className="absolute -inset-1 bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-md -z-10"></span>
                                    <h2 className="text-4xl font-bold lowercase text-neutral-800 relative">
                                        our vision
                                        <span className="absolute -bottom-2 left-0 w-16 h-[2px] bg-gradient-to-r from-neutral-400 to-neutral-200"></span>
                                    </h2>
                                </div>
                                <p className="text-lg text-neutral-600 leading-relaxed">
                                    To be a global leader in AI and blockchain innovation, fostering sustainable growth and transformative technologies.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Values Section */}
                    <section className="mb-32">                        <h2 className="text-4xl font-bold text-center mb-16 lowercase relative after:content-[''] after:absolute after:w-16 after:h-[2px] after:bg-neutral-900 after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2">
                            our core values
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="group bg-white rounded-md transition-all duration-500 transform hover:-translate-y-1 hover:rotate-1 overflow-hidden"
                                 style={{ boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)" }}>
                                <div className="relative aspect-[3/2] overflow-hidden">
                                    <Image
                                        src={getBlobImage("about-value-innovation-image")}
                                        alt="Innovation"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-20"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <div className="relative px-4 py-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-md">
                                            <h3 className="text-2xl font-bold text-neutral-800 lowercase">innovation</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-neutral-100 relative">
                                    <p className="text-neutral-600">
                                        Driving progress through creativity and cutting-edge technology, constantly pushing boundaries of what&apos;s possible.
                                    </p>
                                    <div className="absolute h-full w-[2px] bg-gradient-to-b from-neutral-200 to-transparent left-0 top-0"></div>
                                </div>
                            </div>
                            
                            <div className="group bg-white rounded-md transition-all duration-500 transform hover:-translate-y-1 hover:rotate-1 overflow-hidden"
                                 style={{ boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)" }}>
                                <div className="relative aspect-[3/2] overflow-hidden">
                                    <Image
                                        src={getBlobImage("about-value-integrity-image")}
                                        alt="Integrity"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-20"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <div className="relative px-4 py-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-md">
                                            <h3 className="text-2xl font-bold text-neutral-800 lowercase">integrity</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-neutral-100 relative">
                                    <p className="text-neutral-600">
                                        Upholding the highest standards of honesty and ethics in every aspect of our business and client relationships.
                                    </p>
                                    <div className="absolute h-full w-[2px] bg-gradient-to-b from-neutral-200 to-transparent left-0 top-0"></div>
                                </div>
                            </div>
                            
                            <div className="group bg-white rounded-md transition-all duration-500 transform hover:-translate-y-1 hover:rotate-1 overflow-hidden"
                                 style={{ boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)" }}>
                                <div className="relative aspect-[3/2] overflow-hidden">
                                    <Image
                                        src={getBlobImage("about-value-collaboration-image")}
                                        alt="Collaboration"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-20"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <div className="relative px-4 py-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-md">
                                            <h3 className="text-2xl font-bold text-neutral-800 lowercase">collaboration</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-neutral-100 relative">
                                    <p className="text-neutral-600">
                                        Fostering teamwork and partnerships for greater impact, recognizing that diverse perspectives lead to better solutions.
                                    </p>
                                    <div className="absolute h-full w-[2px] bg-gradient-to-b from-neutral-200 to-transparent left-0 top-0"></div>
                                </div>
                            </div>
                        </div>
                    </section>                    {/* Dynamic Counter Section */}
                    <section className="mb-32 relative">
                        <div className="relative border border-neutral-100 rounded-md overflow-hidden py-16 px-8" 
                             style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)" }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white via-neutral-50 to-neutral-100"></div>
                            <div className="relative">
                                <div className="inline-block mx-auto text-center relative mb-16">
                                    <div className="px-4 py-2 bg-white rounded-lg shadow-sm inline-block relative">
                                        <h2 className="text-4xl font-bold lowercase text-neutral-800 relative">
                                            why choose us
                                        </h2>
                                    </div>
                                    <div className="h-[3px] w-16 mx-auto mt-4 bg-gradient-to-r from-neutral-300 to-neutral-100"></div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                                    <div className="bg-white p-10 rounded-md relative group transition-all duration-500 transform hover:-translate-y-1 hover:rotate-1" 
                                         style={{ boxShadow: "0 15px 40px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)" }}>
                                        <div className="flex flex-col items-center">
                                            <div className="relative inline-block mb-6">
                                                <div className="absolute inset-x-0 -bottom-4 h-2 bg-gradient-to-r from-neutral-200 to-neutral-50 blur-sm"></div>
                                                <h3 className="text-6xl font-bold mb-2 text-neutral-800 tracking-tighter">
                                                    <AnimatedCounter end={82} suffix="%" duration={2000} />
                                                </h3>
                                            </div>
                                            <p className="lowercase text-neutral-600 font-medium text-center text-lg">
                                                customer retention rate over the past 6 years
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-10 rounded-md relative group transition-all duration-500 transform hover:-translate-y-1 hover:rotate-1" 
                                         style={{ boxShadow: "0 15px 40px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)" }}>
                                        <div className="flex flex-col items-center">
                                            <div className="relative inline-block mb-6">
                                                <div className="absolute inset-x-0 -bottom-4 h-2 bg-gradient-to-r from-neutral-200 to-neutral-50 blur-sm"></div>
                                                <h3 className="text-6xl font-bold mb-2 text-neutral-800 tracking-tighter">
                                                    <AnimatedCounter end={100} suffix="+" duration={1800} delay={300} />
                                                </h3>
                                            </div>
                                            <p className="lowercase text-neutral-600 font-medium text-center text-lg">
                                                clients who recommend us to their colleagues
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Meet Our Team Section */}
                    <MeetOurTeam />                    {/* Contact Us Section */}
                    <section className="mb-24 relative">
                        <div className="relative bg-white border border-neutral-100 p-10 rounded-md overflow-hidden group" 
                             style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)" }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white to-neutral-50 -z-10"></div>
                            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"></div>
                            <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-200"></div>
                            <ContactUs />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}