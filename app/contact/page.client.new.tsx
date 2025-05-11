"use client";
import MailerWidget from "@/components/ui/MailerWidget";
import { useEffect } from "react";
import Link from "next/link";
import { OrganizationStructuredData } from "@/components/ui/StructuredData";
import { getBlobImage } from "@/utils/image-utils";

// Define grecaptcha type locally if not globally available
declare global {
    interface Window {
        grecaptcha: any; // Reverted to any to match existing global declaration
    }
}

export default function ContactClientPage() {
    useEffect(() => {
        const scriptId = "recaptcha-enterprise-script";
        if (document.getElementById(scriptId)) return;

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://www.google.com/recaptcha/enterprise.js?render=6LcWFf4qAAAAABZqkkjzL7kpBVbdj9Wq4GFZ_Y9Z";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        return () => {
            // cleanup on unmount: remove script and grecaptcha from window
            const existing = document.getElementById(scriptId);
            if (existing) existing.remove();
            if (window.grecaptcha) delete window.grecaptcha;
        };
    }, []);

    return (
        <>
            {/* Structured data for organization */}
            <OrganizationStructuredData
                name="Fantastic AI Studio"
                url="https://fais.world"
                logo={getBlobImage("logo")}
                description="Leading provider of AI and blockchain solutions for businesses seeking digital transformation and technological innovation."
                sameAs={[
                    "https://twitter.com/faisworld",
                    "https://www.linkedin.com/company/faistudio",
                    "https://github.com/faisworld"
                ]}
                address={{
                    streetAddress: "132 Velyka Vasylkivska St.",
                    addressLocality: "Kyiv",
                    postalCode: "03150",
                    addressCountry: "Ukraine"
                }}
                contactPoint={{
                    telephone: "+380 95 615 1756",
                    contactType: "customer service",
                    email: "info@fais.world",
                    availableLanguage: ["English", "Ukrainian"]
                }}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white text-gray-800" itemScope itemType="https://schema.org/ContactPage">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900 text-center md:text-left lowercase" itemProp="name">
                        contact us
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto" itemProp="description">
                        we&apos;re here to help you transform your business with our {" "}
                        <span className="font-semibold">{"{ai}"}</span> and {" "}
                        <span className="font-semibold">[blockchain solutions]</span>. get in touch with us for inquiries, support, or to learn more about how we can assist you.
                    </p>
                </section>

                {/* Contact Grid Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Contact Form Column */}
                    <div className="lg:col-span-2 bg-neutral-50 p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 lowercase">send us a message</h2>
                        <MailerWidget />
                    </div>

                    {/* Contact Information Column */}
                    <div className="bg-neutral-800 text-white p-8 rounded-lg shadow-sm" itemScope itemType="https://schema.org/Organization">
                        <h2 className="text-2xl font-semibold mb-6 lowercase">contact information</h2>
                        
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-2 lowercase">office location</h3>
                            <address className="not-italic text-gray-300" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                                <span itemProp="streetAddress">132 velyka vasylkivska st.</span><br />
                                <span itemProp="addressLocality">kyiv</span>, <span itemProp="postalCode">03150</span><br />
                                <span itemProp="addressCountry">ukraine</span>
                            </address>
                        </div>
                        
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-2 lowercase">contact details</h3>
                            <p className="text-gray-300 mb-2">
                                <span className="block text-white font-medium">phone:</span>
                                <a href="tel:+380956151756" className="hover:text-blue-300 transition-colors" itemProp="telephone">
                                    +380 95 615 1756
                                </a>
                            </p>
                            <p className="text-gray-300">
                                <span className="block text-white font-medium">email:</span>
                                <a href="mailto:info@fais.world" className="hover:text-blue-300 transition-colors" itemProp="email">
                                    info@fais.world
                                </a>
                            </p>
                        </div>
                        
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-2 lowercase">hours of operation</h3>
                            <p className="text-gray-300">monday - friday: 9:00 AM - 6:00 PM EET</p>
                            <p className="text-gray-300">weekends: by appointment</p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-medium mb-2 lowercase">follow us</h3>
                            <div className="flex space-x-4">
                                <a href="https://twitter.com/fantasticaistudio" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                    </svg>
                                </a>
                                <a href="https://linkedin.com/company/fantasticaistudio" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 transition-colors">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"></path>
                                    </svg>
                                </a>
                                <a href="https://github.com/fantastic-ai-studio" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-6 text-center lowercase">find us</h2>
                    <div className="h-96 bg-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.848974416782!2d30.51711491571651!3d50.42710397947199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf1e8ad0bfdb%3A0xb9c8ea8f2c82a326!2s132%20Velyka%20Vasylkivska%20St%2C%20Kyiv%2C%20Ukraine%2C%2003150!5e0!3m2!1sen!2sus!4v1589965594916!5m2!1sen!2sus" 
                            width="100%" 
                            height="100%" 
                            style={{border: 0}} 
                            allowFullScreen={true} 
                            loading="lazy"
                            aria-hidden="false"
                            tabIndex={0}
                            title="Office Location Map - Fantastic AI Studio"
                        ></iframe>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mb-16" itemScope itemType="https://schema.org/FAQPage">
                    <h2 className="text-2xl font-semibold mb-8 text-center lowercase">frequently asked questions</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-neutral-50 p-6 rounded-lg shadow-sm" itemScope itemType="https://schema.org/Question">
                            <h3 className="text-xl font-medium mb-3 lowercase" itemProp="name">what services do you offer?</h3>
                            <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                                <p className="text-gray-700" itemProp="text">
                                    we specialize in artificial intelligence and blockchain solutions, including custom AI development, enterprise blockchain implementation, smart contracts, and end-to-end digital transformation services.
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-6 rounded-lg shadow-sm" itemScope itemType="https://schema.org/Question">
                            <h3 className="text-xl font-medium mb-3 lowercase" itemProp="name">how quickly can you respond to inquiries?</h3>
                            <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                                <p className="text-gray-700" itemProp="text">
                                    we typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our direct line.
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-6 rounded-lg shadow-sm" itemScope itemType="https://schema.org/Question">
                            <h3 className="text-xl font-medium mb-3 lowercase" itemProp="name">do you offer remote consultations?</h3>
                            <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                                <p className="text-gray-700" itemProp="text">
                                    yes, we offer remote consultations via video conferencing and can work with clients globally. Our team can adapt to your preferred communication methods.
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-6 rounded-lg shadow-sm" itemScope itemType="https://schema.org/Question">
                            <h3 className="text-xl font-medium mb-3 lowercase" itemProp="name">how do we start a project with you?</h3>
                            <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                                <p className="text-gray-700" itemProp="text">
                                    starting a project is easy - just reach out through our contact form or direct email, and we&apos;ll schedule an initial consultation to discuss your requirements and develop a tailored proposal.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="text-center">
                    <div className="bg-neutral-800 text-white p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4 lowercase">ready to transform your business?</h2>
                        <p className="text-lg mb-6 max-w-2xl mx-auto">
                            let&apos;s discuss how our ai and blockchain solutions can address your specific challenges and drive innovation.
                        </p>
                        <Link href="/services" className="inline-block bg-white text-neutral-800 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors lowercase">
                            explore our services
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
