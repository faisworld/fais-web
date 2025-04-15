"use client";

import MeetOurTeam from "@/components/pages/MeetOurTeam";
import ContactUs from "@/components/pages/ContactUs";
import Breadcrumbs from "@/components/Breadcrumbs";
import CountUp from "react-countup";
import Image from "next/image";

export default function AboutPage() {
    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "About Us" },
    ];

    return (
        // Apply padding here to offset the fixed header
        <div className="pt-20"> {/* Adjust pt-20 to match header height */}
            <main className="w-full bg-gray-50 text-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Removed pt-28 */}
                    {/* Breadcrumbs */}
                    <Breadcrumbs items={breadcrumbItems} />

                    {/* Page Title (Implicit H1) */}
                    <h1 className="text-4xl font-bold my-8 text-center md:text-left">About Fantastic AI Studio</h1>

                    {/* Mission Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To drive innovation by delivering cutting-edge AI and blockchain solutions that empower businesses to thrive in the digital age.
                            </p>
                        </div>
                        <div className="order-1 md:order-2 flex justify-center md:justify-end">
                            <Image
                                src="/images/mission.webp"
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
                                src="/images/vision.webp"
                                alt="Our Vision"
                                width={500}
                                height={300}
                                className="rounded-lg shadow-lg object-cover"
                            />
                        </div>
                        <div className="order-2">
                            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To shape a future where technology seamlessly integrates into everyday life, fostering innovation, sustainability, and growth.
                            </p>
                        </div>
                    </section>

                    {/* Core Values Section */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-4">
                                <h3 className="text-2xl font-semibold mb-2">Innovation</h3>
                                <p className="text-gray-600">
                                    We embrace creativity and push the boundaries of technology to deliver groundbreaking solutions.
                                </p>
                            </div>
                            <div className="text-center p-4">
                                <h3 className="text-2xl font-semibold mb-2">Integrity</h3>
                                <p className="text-gray-600">
                                    We uphold the highest standards of ethics and transparency in all our endeavors.
                                </p>
                            </div>
                            <div className="text-center p-4">
                                <h3 className="text-2xl font-semibold mb-2">Collaboration</h3>
                                <p className="text-gray-600">
                                    We believe in the power of teamwork and partnerships to achieve shared success.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Dynamic Counter Section */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
                            <div>
                                <h3 className="text-5xl font-bold text-gray-800">
                                    <CountUp end={82} duration={2.5} />%
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    Customer retention rate over the past 6 years.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-5xl font-bold text-gray-800">
                                    <CountUp end={100} duration={2.5} suffix="+" />
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    Clients who recommend us to their colleagues.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Meet Our Team Section */}
                    <MeetOurTeam />

                    {/* Contact Us Section */}
                    <section className="relative bg-transparent bg-[url('/images/contact-bg.webp')] bg-cover bg-center py-12 mt-16 rounded-lg">
                        <ContactUs />
                    </section>
                </div>
            </main>
        </div>
    );
}