"use client";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MailerWidget from "@/components/ui/MailerWidget";
import { useCallback, useEffect } from "react";

// Define grecaptcha type locally if not globally available
declare global {
    interface Window {
        grecaptcha: any;
    }
}

export default function ContactPageClient() {
    const handleRecaptchaClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (typeof window.grecaptcha === "undefined" || !window.grecaptcha.enterprise) {
            console.error("reCAPTCHA script not loaded or ready.");
            alert("reCAPTCHA is not ready. Please try again later.");
            return;
        }

        try {
            await window.grecaptcha.enterprise.ready();
            const token = await window.grecaptcha.enterprise.execute(
                '6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z',
                { action: 'CONTACT_FORM' }
            );
            console.log('reCAPTCHA token:', token);
            alert("reCAPTCHA verified. Implement form submission logic.");
        } catch (error) {
            console.error("reCAPTCHA execution error:", error);
            alert("Failed to verify reCAPTCHA. Please try again.");
        }
    }, []);

    useEffect(() => {
        const scriptId = "recaptcha-enterprise-script";
        if (document.getElementById(scriptId)) return;

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://www.google.com/recaptcha/enterprise.js?render=6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }, []);

    return (
        <main className="w-full bg-gray-50 text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
                {/* Breadcrumbs */}
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

                {/* Hero Section */}
                <section className="text-center my-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 lowercase">contact us</h1>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        We&apos;re here to help you transform your business with our{" "}
                        <span className="font-semibold text-indigo-600">{`{AI}`}</span> and{" "}
                        <span className="font-semibold text-teal-600">{`[Blockchain Solutions]`}</span>. Get in touch with us for inquiries, support, or to learn more about how we can assist you.
                    </p>
                </section>

                {/* MailerWidget Form Section */}
                <section className="mb-16">
                    <MailerWidget />
                </section>

                {/* Columns Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Column 1: Appointment Calendar */}
                    <div className="bg-white p-8 rounded-lg shadow-md text-center border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Schedule a Consultation</h2>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary inline-block"
                        >
                            Book Now
                        </a>
                    </div>

                    {/* Column 2: Contact Information */}
                    <div className="bg-white p-8 rounded-lg shadow-md text-center border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Details</h2>
                        <p className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">+380 95 615 1756</p>
                        <p className="text-lg text-gray-700 mb-4">
                            <a href="mailto:info@fais.world" className="text-blue-600 hover:text-blue-800 hover:underline">
                                info@fais.world
                            </a>
                        </p>
                        <div className="text-lg text-gray-700">
                            <p className="font-semibold">Office Address:</p>
                            <p>132 Velyka Vasylkivska St.</p>
                            <p>Kyiv, 03150</p>
                            <p>Ukraine</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}