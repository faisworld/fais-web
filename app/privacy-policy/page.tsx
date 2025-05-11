import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Fantastic AI Studio",
  description: "Learn about how Fantastic AI Studio collects, uses, and protects your personal information when you visit our website.",
  keywords: [
    "privacy policy",
    "personal data",
    "data security",
    "cookies",
    "user rights",
    "Fantastic AI Studio",
    "FAIS privacy"
  ],
  openGraph: {
    title: "Privacy Policy | Fantastic AI Studio",
    description: "Learn about how Fantastic AI Studio collects, uses, and protects your personal information.",
    url: "https://fais.world/privacy-policy",
  }
};

export default function PrivacyPolicyPage() {
    return (
        <div className="relative overflow-x-clip"> {/* Removed pt-20 */}
            {/* Subtle background */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-neutral-200 opacity-40 blur-3xl" />
                <div className="absolute bottom-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-neutral-200 opacity-30 blur-3xl" />
            </div>

            <main className="relative z-10 py-20 px-4"> {/* Changed py-16 to py-20 */}
                <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border border-neutral-100 backdrop-blur mb-12">
                    {/* Updated H1 classes */}
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900 text-center">
                        privacy policy for fantastic ai studio
                    </h1>
                    <div className="mb-8 text-center">
                        <p className="text-neutral-600 text-sm">
                            <strong>Effective Date:</strong> July 20, 2024 | <strong>Last Updated:</strong> July 20, 2024
                        </p>
                    </div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">1. introduction</h2>
                        <p className="text-neutral-700 mb-4">
                            Welcome to the Privacy Policy of Fantastic AI Studio (FAIS). We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">2. information we collect</h2>
                        
                        <h3 className="text-xl font-bold mb-2 text-neutral-800">personal data:</h3>
                        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-1">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Contact details</li>
                            <li>Payment information (if applicable)</li>
                        </ul>

                        <h3 className="text-xl font-bold mb-2 text-neutral-800">non-personal data:</h3>
                        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-1">
                            <li>IP address</li>
                            <li>Browser type</li>
                            <li>Operating system</li>
                            <li>Pages visited</li>
                            <li>Time spent on the website</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">3. how we use your information</h2>
                        <p className="text-neutral-700 mb-4">
                            We use the information we collect in the following ways:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
                            <li>To provide, operate, and maintain our website and services.</li>
                            <li>To improve, personalize, and expand our website and services.</li>
                            <li>To communicate with you, including responding to inquiries and providing updates.</li>
                            <li>To process transactions and manage your orders.</li>
                            <li>To analyze usage and trends to improve user experience.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">4. how we share your information</h2>
                        <p className="text-neutral-700 mb-4">
                            We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
                            <li>With trusted service providers who assist us in operating our website, conducting our business, or servicing you, provided those parties agree to keep this information confidential.</li>
                            <li>When we believe release is appropriate to comply with the law, enforce our site policies, or protect our rights, property, or safety.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">5. data security</h2>
                        <p className="text-neutral-700">
                            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure and we cannot guarantee its absolute security.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">6. your rights</h2>
                        <p className="text-neutral-700 mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
                            <li>Access and update your personal information.</li>
                            <li>Request the deletion of your personal information.</li>
                            <li>Object to or restrict our processing of your personal information.</li>
                            <li>Withdraw your consent at any time, without affecting the lawfulness of processing based on consent before its withdrawal.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">7. cookies</h2>
                        <p className="text-neutral-700">
                            Our website may use cookies to enhance user experience. Users can choose to set their web browser to refuse cookies or to alert them when cookies are being sent. If they do so, note that some parts of the site may not function properly.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">8. changes to this privacy policy</h2>
                        <p className="text-neutral-700">
                            FAIS reserves the right to update this Privacy Policy at any time. We will notify you of any changes by posting the new Privacy Policy on our website. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">9. contact us</h2>
                        <p className="text-neutral-700 mb-4">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                            <p className="text-neutral-700 mb-2">
                                <strong>Yevheniy Lukyanov</strong>
                            </p>
                            <p className="text-neutral-700 mb-2">
                                <strong>Email:</strong> [Email protected]
                            </p>
                            <p className="text-neutral-700">
                                <strong>Address:</strong> 132 Velyka Vasylkivska Str., off. 13, Kyiv, Ukraine
                            </p>
                        </div>
                    </section>
                </div>

                <div className="max-w-3xl mx-auto text-center">
                    <Link
                        href="/"
                        className="btn inline-block px-6 py-2 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition"
                    >
                        back to home
                    </Link>
                </div>
            </main>
        </div>
    );
}