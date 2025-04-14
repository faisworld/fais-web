"use client";

import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import MailerWidget from "@/components/MailerWidget";
import { useCallback, useEffect } from "react";

export default function ContactPage() {
    const handleRecaptchaClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (typeof grecaptcha === "undefined" || !grecaptcha.enterprise) {
            alert("reCAPTCHA is not ready. Please try again later.");
            return;
        }

        grecaptcha.enterprise.ready(async () => {
            const token = await grecaptcha.enterprise.execute('6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z', { action: 'LOGIN' });
            console.log('reCAPTCHA token:', token);
        });
    }, []);

    // Load reCAPTCHA script when component mounts
    useEffect(() => {
        // Only load the script if it hasn't been loaded already
        if (!document.querySelector('script[src="https://www.google.com/recaptcha/enterprise.js?render=6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z"]')) {
            const script = document.createElement('script');
            script.src = "https://www.google.com/recaptcha/enterprise.js?render=6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Contact Us - Fantastic AI Studio</title>
                <meta name="description" content="Get in touch with Fantastic AI Studio for inquiries, support, or to learn more about our AI and blockchain solutions." />
            </Head>
            <Header />
            <main className="relative w-full px-6 py-12 bg-gray-50 text-gray-800">
                <div className="max-w-7xl mx-auto pt-16">
                    {/* Breadcrumbs */}
                    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

                    {/* Hero Section */}
                    <section className="text-center mb-16">
                        <h1 className="text-6xl font-bold text-gray-900 mb-8 lowercase">contact us</h1>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            we&apos;re here to help you transform your business with our <span className="font-bold">{`{ai}`}</span> and <span className="font-bold">{`[blockchain solutions]`}</span>. get in touch with us for inquiries, support, or to learn more about how we can assist you.
                        </p>
                    </section>

                    {/* MailerWidget Form */}
                    <MailerWidget />

                    {/* Columns Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Column 1: Appointment Calendar */}
                        <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center">
                            <h2 className="text-2xl font-semibold mb-6">fais appointment calendar</h2>
                            <button className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition" onClick={handleRecaptchaClick}>book now</button>
                        </div>

                        {/* Column 2: Contact Information */}
                        <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center">
                            <p className="text-3xl font-bold mb-4">+380 95 615 1756</p>
                            <p className="text-lg text-gray-700 mb-4">
                                <a href="mailto:info@fais.world" className="text-blue-600 hover:underline">info@fais.world</a>
                            </p>
                            <p className="text-lg text-gray-700">
                                <span className="font-bold">office address:</span><br />
                                03150<br />
                                ukraine, kyiv<br />
                                132 velyka vasylkivska str.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}