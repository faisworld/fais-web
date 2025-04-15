import Image from 'next/image';
import type { Metadata, Viewport } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProjectsClientContent from './components/ProjectsClientContent';

export const metadata: Metadata = {
    title: 'Our Projects - Fantastic AI Studio',
    description: 'Explore our innovative AI and blockchain projects.',
};

export function generateViewport(): Viewport {
    return {
        themeColor: '#ffffff',
    };
}

export default function ProjectsPage() {
    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Projects" },
    ];

    return (
        <div className="pt-20">
            <main className="w-full bg-gray-50 text-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Breadcrumbs items={breadcrumbItems} />
                    <div className="relative w-full h-64 md:h-96 my-8">
                        <Image
                            src="/images/ai-crypto-projects-banner.jpg"
                            alt="AI and Crypto Projects Banner"
                            fill
                            className="object-cover rounded-lg shadow-md"
                            priority
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">Our Projects</h1>
                        </div>
                    </div>
                    <ProjectsClientContent />
                </div>
            </main>
        </div>
    );
}