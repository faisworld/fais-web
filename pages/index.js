import React from 'react';
import Layout from '../components/Layout';
import AssistantWidget from '../components/AssistantWidget';

const Home = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold mb-4">Welcome to Fantastic AI Studio</h1>
                <p className="text-lg mb-8">Showcasing innovative AI and blockchain solutions.</p>
                <AssistantWidget />
            </div>
        </Layout>
    );
};

export default Home;