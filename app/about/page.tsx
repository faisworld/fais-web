"use client";

import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MeetOurTeam from "./components/MeetOurTeam";
import ContactUs from "./components/ContactUs";
import CountUp from "react-countup";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    return (
        <>
            <Head>
                <title>About Us - Fantastic AI Studio</title>
                <meta name="description" content="Learn more about Fantastic AI Studio and our mission to drive innovation in AI and blockchain technology." />
            </Head>
            <Header />
            <main className="relative w-full px-6 py-12 bg-gray-50 text-gray-800">
                <div className="max-w-7xl mx-auto pt-16">
                    {/* Breadcrumbs */}
                    <nav className="text-sm text-gray-600 mb-8">
                        <ol className="list-reset flex">
                            <li>
                                <Link href="/" className="text-blue-600 hover:underline">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <span className="mx-2">/</span>
                            </li>
                            <li className="text-gray-500">About</li>
                        </ol>
                    </nav>

                    {/* Mission Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To drive innovation by delivering cutting-edge AI and blockchain solutions that empower businesses to thrive in the digital age.
                            </p>
                        </div>
                        <div className="order-1 md:order-2">
                            <Image
                                src="/images/mission.webp"
                                alt="Our Mission"
                                width={500}
                                height={300}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    </section>

                    {/* Vision Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
                        <div className="order-1">
                            <Image
                                src="/images/vision.webp"
                                alt="Our Vision"
                                width={500}
                                height={300}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="order-2">
                            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To shape a future where technology seamlessly integrates into everyday life, fostering innovation, sustainability, and growth.
                            </p>
                        </div>
                    </section>

                    {/* Core Values Section */}
                    <section className="mt-16">
                        <h2 className="text-2xl font-semibold text-center mb-8">Our Core Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <h3 className="text-lg font-bold mb-2">Innovation</h3>
                                <p className="text-gray-600">
                                    We embrace creativity and push the boundaries of technology to deliver groundbreaking solutions.
                                </p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold mb-2">Integrity</h3>
                                <p className="text-gray-600">
                                    We uphold the highest standards of ethics and transparency in all our endeavors.
                                </p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold mb-2">Collaboration</h3>
                                <p className="text-gray-600">
                                    We believe in the power of teamwork and partnerships to achieve shared success.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Dynamic Counter Section */}
                    <section className="mt-16">
                        <h2 className="text-2xl font-semibold text-center mb-8">Why Choose Us</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
                            <div>
                                <h3 className="text-4xl font-bold text-gray-800">
                                    <CountUp end={82} duration={2} />%
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    Customer retention rate over the past 6 years.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-gray-800">
                                    <CountUp end={100} duration={2} />+
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
                    <section className="relative bg-transparent bg-[url('/images/contact-bg.webp')] bg-cover bg-center py-12">
                        <ContactUs />
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}