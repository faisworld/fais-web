"use client";

import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ServicesPage() {
    return (
        <>
            <Head>
                <title>Our Services - Fantastic AI Studio</title>
                <meta name="description" content="Explore the wide range of services offered by Fantastic AI Studio, from AI solutions to blockchain development." />
            </Head>
            <Header />
            <main className="container-padding py-8 bg-gray-50 text-gray-800">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumbs */}
                    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />

                    {/* Hero Section */}
                    <section className="text-center mb-16">
                        <h2>Our Services</h2>
                        <p className="text-lg text-gray-600">
                            Empowering businesses with cutting-edge AI and blockchain solutions tailored to your needs.
                        </p>
                    </section>

                    {/* AI Services Section */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Services</h2>
                        <p className="text-gray-600 mb-4">
                            Harness the power of AI to optimize your processes, make informed decisions, and innovate.
                        </p>
                        <ul className="list-disc list-inside text-gray-600">
                            <li><strong>Predictive Analytics:</strong> Forecast trends and behaviors using advanced algorithms.</li>
                            <li><strong>Natural Language Processing (NLP):</strong> Enable machines to understand and interact with human language.</li>
                            <li><strong>Computer Vision:</strong> Analyze and interpret visual data for improved security and automation.</li>
                            <li><strong>Machine Learning Models:</strong> Custom models for task automation and process optimization.</li>
                            <li><strong>AI-Powered Chatbots:</strong> Enhance customer interaction with intelligent responses.</li>
                            <li><strong>Robotic Process Automation (RPA):</strong> Automate repetitive tasks to boost efficiency.</li>
                        </ul>
                    </section>

                    {/* Blockchain Solutions Section */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Blockchain Solutions</h2>
                        <p className="text-gray-600 mb-4">
                            Build secure and scalable blockchain solutions to transform your operations.
                        </p>
                        <ul className="list-disc list-inside text-gray-600">
                            <li><strong>Smart Contracts:</strong> Automate and secure transactions with self-executing contracts.</li>
                            <li><strong>Decentralized Applications (DApps):</strong> Create innovative applications on blockchain platforms.</li>
                            <li><strong>Tokenization:</strong> Digitize assets for enhanced liquidity and accessibility.</li>
                            <li><strong>Blockchain Integration:</strong> Seamlessly integrate blockchain into your existing systems.</li>
                        </ul>
                    </section>

                    {/* Why Choose Us Section */}
                    <section className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Fantastic AI Studio?</h2>
                        <p className="text-gray-600 mb-4">
                            Fantastic AI Studio is dedicated to delivering top-tier AI and blockchain solutions, ensuring your projects are future-proof, scalable, and secure.
                        </p>
                        <a href="/contact" className="px-6 py-3 text-white rounded-lg shadow-md">
                            Book an Appointment
                        </a>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}