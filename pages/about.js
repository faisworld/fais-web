import React from 'react';
import Layout from '../components/Layout';

const About = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">About Fantastic AI Studio</h1>
                <p className="mb-4">
                    Fantastic AI Studio is dedicated to providing innovative AI and blockchain solutions. Our team of experts is committed to delivering cutting-edge technology that empowers businesses and enhances user experiences.
                </p>
                <p className="mb-4">
                    With a focus on quality and customer satisfaction, we strive to create products that not only meet but exceed expectations. Our portfolio showcases a range of projects that highlight our capabilities and the impact of our solutions.
                </p>
                <p>
                    Join us on our journey to revolutionize the digital landscape with AI and blockchain technology.
                </p>
            </div>
        </Layout>
    );
};

export default About;