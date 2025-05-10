'use client';

import MeetOurTeam from "@/components/pages/MeetOurTeam";
import ContactUs from "@/components/pages/ContactUs";
import CountUp from "react-countup";
import Image from "next/image";

export default function AboutPage() {
    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "About Us" },
    ];

    return (
        <div>
            <main>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Page Title */}
                    <h1 className="text-4xl font-bold my-8 text-center md:text-left lowercase">about fantastic ai studio</h1>

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
                                src="/images/mission.webp"
                                alt="Our Mission"
                                width={500}
                                height={300}
                                className="rounded-lg shadow-lg object-cover"
                            />
                        </div>
                    </section>                    {/* Vision Section */}
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
                            <h2 className="text-3xl font-bold mb-4 lowercase">our vision</h2>
                            <p className="lowercase">
                                to shape a future where technology seamlessly integrates into everyday life, fostering innovation, sustainability, and growth.
                            </p>
                        </div>
                    </section>

                    {/* Core Values Section */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-center mb-8 lowercase">our core values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-4">
                                <h3 className="text-2xl font-semibold mb-2 lowercase">innovation</h3>
                                <p className="lowercase">
                                    we embrace creativity and push the boundaries of technology to deliver groundbreaking solutions.
                                </p>
                            </div>
                            <div className="text-center p-4">
                                <h3 className="text-2xl font-semibold mb-2 lowercase">integrity</h3>
                                <p className="lowercase">
                                    we uphold the highest standards of ethics and transparency in all our endeavors.
                                </p>
                            </div>
                            <div className="text-center p-4">
                                <h3 className="text-2xl font-semibold mb-2 lowercase">collaboration</h3>
                                <p className="lowercase">
                                    we believe in the power of teamwork and partnerships to achieve shared success.
                                </p>
                            </div>
                        </div>
                    </section>                    {/* Dynamic Counter Section */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-center mb-8 lowercase">why choose us</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
                            <div>
                                <h3 className="text-5xl font-bold">
                                    <CountUp end={82} duration={2.5} />%
                                </h3>
                                <p className="mt-2 lowercase">
                                    customer retention rate over the past 6 years.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-5xl font-bold">
                                    <CountUp end={100} duration={2.5} suffix="+" />
                                </h3>
                                <p className="mt-2 lowercase">
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
                </div>
            </main>
        </div>
    );
}