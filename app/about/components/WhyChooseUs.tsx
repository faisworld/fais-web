import Image from "next/image";

export default function WhyChooseUs() {
    return (
        <div className="mt-16">
            <h2 className="text-3xl font-semibold text-center mb-8">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-xl font-bold mb-2">Creative Approach</h3>
                    <p className="text-gray-600">
                        Innovative solutions tailored to your needs.
                    </p>
                    <h3 className="text-xl font-bold mb-2">Client-Oriented</h3>
                    <p className="text-gray-600">
                        Dedicated to providing the highest level of service.
                    </p>
                    <h3 className="text-xl font-bold mb-2">Planning</h3>
                    <p className="text-gray-600">
                        Strategic planning for achieving your goals.
                    </p>
                    <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                    <p className="text-gray-600">
                        Continuous support to ensure your success.
                    </p>
                </div>
                <div>
                    <Image
                        src="/images/why-choose-us.webp"
                        alt="Why Choose Us"
                        width={500}
                        height={300}
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
}