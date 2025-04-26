"use client";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Link from "next/link";

export default function ServicesPage() {
    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Services" },
    ];

    return (
        <div className="pt-20"> {/* Adjust pt-20 to match header height */}
            <main>
                <div className="max-w-7xl mx-auto container-padding py-12"> {/* Removed pt-28 */}
                    {/* Breadcrumbs */}
                    <Breadcrumbs items={breadcrumbItems} />

                    {/* Hero Section */}
                    <section className="text-center my-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
                        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                            Empowering businesses with cutting-edge AI and blockchain solutions tailored to your needs.
                        </p>
                    </section>

                    {/* AI Services Section */}
                    <section className="mb-16 p-6 rounded-lg shadow-md border">
                        <h2 className="text-3xl font-bold mb-6">AI Services</h2>
                        <p className="mb-6 leading-relaxed">
                            Harness the power of Artificial Intelligence to optimize your processes, gain valuable insights from data, make informed decisions, and drive innovation within your organization.
                        </p>
                        <ul className="space-y-3 list-disc list-inside">
                            <li><strong>Predictive Analytics:</strong> Forecast trends, customer behavior, and market changes using advanced statistical modeling and machine learning algorithms.</li>
                            <li><strong>Natural Language Processing (NLP):</strong> Enable machines to understand, interpret, and respond to human language for applications like sentiment analysis, chatbots, and content summarization.</li>
                            <li><strong>Computer Vision:</strong> Develop systems that can interpret and understand visual information from the world, enabling image recognition, object detection, and video analysis.</li>
                            <li><strong>Machine Learning Models:</strong> Build and deploy custom machine learning models tailored to your specific business challenges, automating tasks and optimizing complex processes.</li>
                            <li><strong>AI-Powered Chatbots:</strong> Enhance customer engagement and support efficiency with intelligent, conversational chatbots available 24/7.</li>
                            <li><strong>Robotic Process Automation (RPA):</strong> Automate repetitive, rule-based tasks across various applications to boost operational efficiency and reduce human error.</li>
                        </ul>
                    </section>

                    {/* Blockchain Solutions Section */}
                    <section className="mb-16 p-6 rounded-lg shadow-md border">
                        <h2 className="text-3xl font-bold mb-6">Blockchain Solutions</h2>
                        <p className="mb-6 leading-relaxed">
                            Leverage the security, transparency, and efficiency of blockchain technology to build secure, scalable, and decentralized solutions that transform your operations and create new business models.
                        </p>
                        <ul className="space-y-3 list-disc list-inside">
                            <li><strong>Smart Contracts Development:</strong> Design, develop, and deploy self-executing contracts with predefined rules to automate agreements and transactions securely and transparently.</li>
                            <li><strong>Decentralized Applications (DApps):</strong> Create innovative, censorship-resistant applications on various blockchain platforms, offering enhanced user control and data security.</li>
                            <li><strong>Tokenization Services:</strong> Represent real-world assets digitally on a blockchain (tokenization) to improve liquidity, enable fractional ownership, and streamline asset management.</li>
                            <li><strong>Blockchain Integration:</strong> Seamlessly integrate blockchain technology with your existing enterprise systems (ERP, CRM, SCM) to enhance data integrity and process efficiency.</li>
                            <li><strong>Consulting & Strategy:</strong> Expert guidance on identifying blockchain use cases, choosing the right platform, and developing a roadmap for successful implementation.</li>
                        </ul>
                    </section>

                    {/* Why Choose Us / CTA Section */}
                    <section className="text-center my-16 p-8 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-4">Ready to Innovate?</h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            Fantastic AI Studio is dedicated to delivering top-tier AI and blockchain solutions. Let us help you build future-proof, scalable, and secure applications.
                        </p>
                        <Link href="/contact" className="btn btn-light">
                            Book an Appointment
                        </Link>
                    </section>
                </div>
            </main>
        </div>
    );
}