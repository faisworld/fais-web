import React from 'react';
import Image from 'next/image'; // Import Next.js Image component

const features = [
    {
        title: 'Creative Approach',
        description: 'Innovative solutions tailored to your needs.',
        icon: '/images/creative-approach.svg',
    },
    {
        title: 'Client-Oriented',
        description: 'Dedicated to providing the highest level of service.',
        icon: '/images/client-oriented.svg',
    },
    {
        title: 'Strategic Planning',
        description: 'Strategic planning for achieving your goals.',
        icon: '/images/planning.svg',
    },
    {
        title: '24/7 Support',
        description: 'Continuous support to ensure your success.',
        icon: '/images/support.svg',
    },
];

const WhyChooseUs: React.FC = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-semibold text-center mb-8">Why Choose Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="mb-4">
                                {/* Use Next.js Image component */}
                                <Image 
                                    src={feature.icon} 
                                    alt={`${feature.title} icon`} 
                                    width={64} 
                                    height={64} 
                                    className="mx-auto h-16 w-16 text-gray-800" 
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;