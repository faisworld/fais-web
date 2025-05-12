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
        <div>
            <main>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900 text-center md:text-left lowercase">about fantastic ai studio</h1>

                    {/* Mission Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl font-bold mb-4 lowercase">our mission</h2>
                            <p className="lowercase">
                                to drive innovation by delivering cutting-edge ai and blockchain solutions that empower businesses to thrive in the digital age.
                            </p>
                        </div>
                        <div className="order-1 md:order-2 flex justify-center md:justify-end">
                            <Image
                                src={getBlobImage("about-mission-image")}
                                alt="Our Mission"
                                width={500}
                                height={300}
                                className="rounded-lg shadow-lg object-cover"
                            />
                        </div>
                    </section>

                    {/* Vision Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="order-1 flex justify-center md:justify-start">
                            <Image
                                src={getBlobImage("about-vision-image")}
                                alt="Our Vision"
                                width={500}
                                height={300}
                                className="rounded-lg shadow-lg object-cover"
                            />
                        </div>
                        <div className="order-2 flex flex-col gap-6">
                            <h2 className="text-3xl font-bold mb-4 lowercase">our vision</h2>
                            <p className="lowercase">
                                to be a global leader in ai and blockchain innovation, fostering sustainable growth and transformative technologies.
                            </p>
                        </div>
                    </section>

                    {/* Values Section */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start mb-16">
                        <div className="text-center">
                            <Image
                                src={getBlobImage("about-value-innovation-image")}
                                alt="Innovation"
                                width={300}
                                height={200}
                                className="rounded-lg shadow-lg object-cover mx-auto"
                            />
                            <h3 className="text-2xl font-semibold mt-4 lowercase">innovation</h3>
                            <p className="lowercase">
                                driving progress through creativity and cutting-edge technology.
                            </p>
                        </div>
                        <div className="text-center">
                            <Image
                                src={getBlobImage("about-value-integrity-image")}
                                alt="Integrity"
                                width={300}
                                height={200}
                                className="rounded-lg shadow-lg object-cover mx-auto"
                            />
                            <h3 className="text-2xl font-semibold mt-4 lowercase">integrity</h3>
                            <p className="lowercase">
                                upholding the highest standards of honesty and ethics.
                            </p>
                        </div>
                        <div className="text-center">
                            <Image
                                src={getBlobImage("about-value-collaboration-image")}
                                alt="Collaboration"
                                width={300}
                                height={200}
                                className="rounded-lg shadow-lg object-cover mx-auto"
                            />
                            <h3 className="text-2xl font-semibold mt-4 lowercase">collaboration</h3>
                            <p className="lowercase">
                                fostering teamwork and partnerships for greater impact.
                            </p>
                        </div>
                    </section>

                    {/* Dynamic Counter Section */}
                    <section className="mb-16 py-12 bg-neutral-800 rounded-lg">
                        <h2 className="text-3xl font-bold text-center mb-8 lowercase text-white">why choose us</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <h3 className="text-5xl font-bold mb-2 text-black">
                                    <AnimatedCounter end={82} suffix="%" duration={2000} />
                                </h3>
                                <p className="mt-2 lowercase text-gray-700 font-medium">
                                    customer retention rate over the past 6 years.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <h3 className="text-5xl font-bold mb-2 text-black">
                                    <AnimatedCounter end={100} suffix="+" duration={1800} delay={300} />
                                </h3>
                                <p className="mt-2 lowercase text-gray-700 font-medium">
                                    clients who recommend us to their colleagues.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Meet Our Team Section */}
                    <MeetOurTeam />

                    {/* Contact Us Section */}
                    <section className="relative bg-transparent bg-cover bg-center py-12 mt-16 rounded-lg">
                        <ContactUs />
                    </section>
                </section>
            </main>
        </div>
    );
}