"use client";
import MailerWidget from "@/components/ui/MailerWidget";
import { useEffect } from "react";
import Link from "next/link";
import { OrganizationStructuredData } from "@/components/ui/StructuredData";
import { getBlobImage } from "@/utils/media-utils";
import Button from "@/components/ui/Button";
import { loadRecaptchaScript } from "@/utils/recaptcha";
import { track } from '@vercel/analytics';

export default function ContactClientPage() {
    useEffect(() => {
        // Track contact page visit
        track('contact_page_visit', {
            timestamp: new Date().toISOString(),
            source: 'direct'
        });

        // Load reCAPTCHA script using the new utility
        loadRecaptchaScript(
            () => console.log("reCAPTCHA script loaded successfully"),
            (error) => console.error("Failed to load reCAPTCHA script:", error)
        );
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
                    "https://www.linkedin.com/company/faistudio/",
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
                <div> {/* Simplified div, as main now handles max-width and padding */}
                    {/* Hero Section */}                    <section className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900 text-center md:text-left lowercase" itemProp="name">
                            contact us
                        </h1>
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto" itemProp="description">
                            we&apos;re here to help you transform your business with our{" "}
                            <span className="font-semibold text-blue-600">{"{ai}"}</span> and{" "}
                            <span className="font-semibold text-blue-600">[blockchain solutions]</span>. get in touch with us for inquiries, support, or to learn more about how we can assist you.
                        </p>
                    </section>

                    {/* Contact Grid Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">                        {/* Contact Form Column */}
                        <div className="lg:col-span-2 bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-semibold mb-6 lowercase">send us a message</h2>
                            <MailerWidget />
                        </div>

                        {/* Contact Information Column */}
                        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200" itemScope itemType="https://schema.org/Organization">
                            <h2 className="text-2xl font-semibold mb-6 lowercase text-gray-800 border-b pb-3">contact information</h2>
                              <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-medium mb-2 lowercase text-gray-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    office location
                                </h3>
                                <address className="not-italic text-gray-600 pl-7" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                                    <span itemProp="streetAddress">132 velyka vasylkivska st.</span><br />
                                    <span itemProp="addressLocality">kyiv</span>, <span itemProp="postalCode">03150</span><br />
                                    <span itemProp="addressCountry">ukraine</span>
                                </address>
                            </div>                            <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-medium mb-2 lowercase text-gray-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    contact details
                                </h3>
                                <div className="pl-7">
                                    <p className="text-gray-600 mb-2">
                                        <span className="block text-gray-800 font-medium">phone:</span>
                                        <a href="tel:+380956151756" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors" itemProp="telephone">
                                            +380 95 615 1756
                                        </a>
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="block text-gray-800 font-medium">email:</span>
                                        <a href="mailto:info@fais.world" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors" itemProp="email">
                                            info@fais.world
                                        </a>
                                    </p>
                                </div>
                            </div>
                              <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-medium mb-2 lowercase text-gray-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    hours of operation
                                </h3>
                                <div className="pl-7">
                                    <p className="text-gray-600">monday - friday: 9:00 AM - 6:00 PM EET</p>
                                    <p className="text-gray-600">weekends: by appointment</p>
                                </div>
                            </div>                            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-medium mb-3 lowercase text-gray-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    follow us
                                </h3>
                                <div className="flex space-x-4 pl-7">
                                    <a href="https://twitter.com/fantasticaistudio" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                        </svg>
                                    </a>
                                    <a href="https://linkedin.com/company/fantasticaistudio" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors">
                                        <span className="sr-only">LinkedIn</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"></path>
                                        </svg>
                                    </a>
                                    <a href="https://github.com/fantastic-ai-studio" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                                        <span className="sr-only">GitHub</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}                    <section className="mb-16">
                        <h2 className="text-2xl font-semibold mb-6 text-center lowercase">find us</h2>
                        <div className="h-96 bg-gray-100 rounded-lg shadow-sm overflow-hidden border border-gray-200">
                            <iframe                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.848974416782!2d30.51711491571651!3d50.42710397947199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf1e8ad0bfdb%3A0xb9c8ea8f2c82a326!2s132%20Velyka%20Vasylkivska%20St%2C%20Kyiv%2C%20Ukraine%2C%2003150!5e0!3m2!1sen!2sus!4v1589965594916!5m2!1sen!2sus" 
                                width="100%" 
                                height="100%" 
                                style={{border: 0}} 
                                allowFullScreen={true} 
                                loading="lazy"
                                aria-hidden="false"
                                tabIndex={0}
                                title="Office Location Map - Fantastic AI Studio in Kyiv, Ukraine"
                                aria-label="Interactive map showing the Fantastic AI Studio office location in Kyiv, Ukraine at 132 Velyka Vasylkivska Street"
                            ></iframe>
                        </div>
                    </section>

                    {/* FAQ Section */}                    <section className="mb-16" itemScope itemType="https://schema.org/FAQPage">
                        <h2 className="text-2xl font-semibold mb-8 text-center lowercase">frequently asked questions</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow" itemScope itemType="https://schema.org/Question">
                                <h3 className="text-xl font-medium mb-3 lowercase text-gray-800 flex items-center" itemProp="name">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    what services do you offer?
                                </h3>
                                <div className="pl-7" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                                    <p className="text-gray-600" itemProp="text">
                                        we specialize in artificial intelligence and blockchain solutions, including custom AI development, enterprise blockchain implementation, smart contracts, and end-to-end digital transformation services.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow" itemScope itemType="https://schema.org/Question">
                                <h3 className="text-xl font-medium mb-3 lowercase text-gray-800 flex items-center" itemProp="name">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    how quickly can you respond to inquiries?
                                </h3>
                                <div className="pl-7" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                                    <p className="text-gray-600" itemProp="text">
                                        we typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our direct line.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow" itemScope itemType="https://schema.org/Question">
                                <h3 className="text-xl font-medium mb-3 lowercase text-gray-800 flex items-center" itemProp="name">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    do you offer remote consultations?
                                </h3>
                                <div className="pl-7" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                                    <p className="text-gray-600" itemProp="text">
                                        yes, we offer remote consultations via video conferencing and can work with clients globally. Our team can adapt to your preferred communication methods.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow" itemScope itemType="https://schema.org/Question">
                                <h3 className="text-xl font-medium mb-3 lowercase text-gray-800 flex items-center" itemProp="name">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                    </svg>
                                    how do we start a project with you?
                                </h3>
                                <div className="pl-7" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                                    <p className="text-gray-600" itemProp="text">
                                        starting a project is easy - just reach out through our contact form or direct email, and we&apos;ll schedule an initial consultation to discuss your requirements and develop a tailored proposal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>{/* CTA Section */}                    <section className="text-center">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-10 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-3xl font-bold mb-4 lowercase text-gray-800">ready to transform your business?</h2>
                            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
                                let&apos;s discuss how our ai and blockchain solutions can address your specific challenges and drive innovation.
                            </p>                            <Link href="/services" style={{ textDecoration: 'none' }}>
                                <Button size="lg">
                                    explore our services
                                </Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
