import React from 'react';
import Image from 'next/image';

// Sample testimonial data structure
const testimonials = [
    {
        id: 1,
        quote: "Fantastic AI Studio delivered exceptional results, exceeding our expectations with their innovative AI solutions. Their team was professional, knowledgeable, and highly responsive.",
        name: "Jane Doe",
        title: "CEO, Tech Innovators Inc.",
        // image: "/images/avatars/jane-doe.png", // Optional avatar image path
    },
    {
        id: 2,
        quote: "Working with Fantastic AI Studio on our blockchain project was seamless. Their expertise in smart contracts and DApps is top-notch. Highly recommended!",
        name: "John Smith",
        title: "CTO, Future Systems Ltd.",
        // image: "/images/avatars/john-smith.png", // Optional avatar image path
    },
    {
        id: 3,
        quote: "The insights we gained from their predictive analytics service have been invaluable to our business strategy. A truly fantastic partner.",
        name: "Alice Brown",
        title: "Marketing Director, Global Corp",
        // image: "/images/avatars/alice-brown.png", // Optional avatar image path
    },
];

const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">What Our Clients Say</h2>
                    <p className="mt-4 text-lg max-w-2xl mx-auto">
                        Hear directly from businesses that have partnered with us.
                    </p>
                </div>

                {/* Grid layout for testimonials (can be replaced with a slider/carousel later) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                            <blockquote className="italic mb-4 flex-grow">
                                &quot;{testimonial.quote}&quot; {/* Escaped quotes */}
                            </blockquote>
                            <footer className="text-right">
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm">{testimonial.title}</p>
                            </footer>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;