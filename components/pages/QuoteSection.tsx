// filepath: c:\Users\solar\Projects\fais-web\components\pages\QuoteSection.tsx
"use client";
import Image from "next/image";

export default function QuoteSection() {
    return (
        <section className="relative w-full p-8 text-white bg-[url('/images/background-image.jpg')] bg-fixed bg-cover bg-center">
            <div className="absolute inset-0 bg-black/80" />
            <div className="relative flex">
                {/* Left Side */}
                <div className="w-1/2">
                    <h2 className="text-3xl font-bold mb-4">
                        We drive innovation in AI and blockchain technology.
                    </h2>
                    <h3 className="text-xl">
                        an effective way to empower your business
                    </h3>
                </div>

                {/* Right Side */}
                <div className="w-1/2 text-center">
                    <Image
                        src="/images/fais-ceo-Eugene-Lukyanov.jpg"
                        alt="CEO and Founder of Fantastic AI Studio, Eugene Lukianov"
                        width={200}
                        height={200}
                        style={{ objectFit: "cover" }}
                        className="mx-auto rounded-full"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/default-ceo.png"; // Provide a default
                        }}
                    />
                    <p className="text-sm mt-2">Eugene Lukianov</p>
                    <p className="text-xs italic text-gray-400">CEO and Founder of Fantastic AI Studio</p>
                    <p className="text-base mt-4">
                        fantastic AI studio is the premier choice for enterprises
                        seeking to enhance their operations with the latest in AI
                        and blockchain innovations. our expertise and advanced
                        technological solutions translate into tangible benefits
                        for your business, optimizing processes and securing
                        transactions
                    </p>
                    <p className="text-lg mt-4">
                        &quot;choosing fantastic AI studio not only ensures access to
                        top-tier AI and blockchain development but also reduces
                        the need for extensive external resources, offering a
                        streamlined path to digital transformation&quot;.
                    </p>
                </div>
            </div>
        </section>
    );
}

export function SolutionsSection() {
    return (
        <section className="mt-[20px] mx-[10%]">
            <h2 className="text-3xl font-bold text-center">
                advanced {"{ai}"} - [blockchain] solutions
            </h2>
            <p className="text-center">
                fantastic ai studio merges sleek, modern design with robust
                technological frameworks to revolutionize your digital
                experiences. we stand at the intersection of creativity and
                technology, crafting ai and blockchain solutions that push the
                boundaries of what&apos;s possible.
            </p>

            <div className="flex flex-wrap justify-center">
                {/* AI-Powered Solutions Column */}
                <div className="w-1/2 p-4">
                    <h3 className="text-2xl font-bold mb-4 text-center">
                        AI-Powered Solutions
                    </h3>
                    <Image
                        src="/images/ai-placeholder.png"
                        alt="AI Placeholder"
                        width={600}
                        height={400}
                        style={{ objectFit: "contain" }}
                        className="mx-auto"
                    />
                    <p className="mt-4 text-center">
                        Harness the power of artificial intelligence to optimize your
                        operations, enhance decision-making, and create intelligent
                        systems that learn and adapt.
                    </p>
                </div>

                {/* Blockchain Innovations Column */}
                <div className="w-1/2 p-4">
                    <h3 className="text-2xl font-bold mb-4 text-center">
                        Blockchain Innovations
                    </h3>
                    <Image
                        src="/images/blockchain-placeholder.png"
                        alt="Blockchain Placeholder"
                        width={600}
                        height={400}
                        style={{ objectFit: "contain" }}
                        className="mx-auto"
                    />
                    <p className="mt-4 text-center">
                        Secure and transparent blockchain applications custom-designed
                        to streamline your business processes and ensure integrity in
                        every transaction.
                    </p>
                </div>
            </div>
        </section>
    );
}