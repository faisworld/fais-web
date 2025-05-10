import Link from "next/link";

export const metadata = {
  title: "Terms of Use | Fantastic AI Studio",
  description: "Read the terms and conditions for using Fantastic AI Studio's website and services.",
  keywords: [
    "terms of use",
    "terms of service",
    "legal terms",
    "website terms",
    "user agreement",
    "FAIS terms",
    "Fantastic AI Studio legal"
  ],
  openGraph: {
    title: "Terms of Use | Fantastic AI Studio",
    description: "Read the terms and conditions for using Fantastic AI Studio's website and services.",
    url: "https://fais.world/terms-of-service",
  }
};

export default function TermsOfServicePage() {
    return (
        <div className="relative overflow-x-clip">
            {/* Subtle background */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-neutral-200 opacity-40 blur-3xl" />
                <div className="absolute bottom-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-neutral-200 opacity-30 blur-3xl" />
            </div>

            <main className="relative z-10 py-16 px-4">
                <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border border-neutral-100 backdrop-blur mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-neutral-900 text-center">
                        terms of use
                    </h1>
                    <div className="mb-8 text-center">
                        <p className="text-neutral-600 text-sm">
                            <strong>Effective Date:</strong> July 20, 2024 | <strong>Last Updated:</strong> July 20, 2024
                        </p>
                    </div>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">1. acceptance of terms</h2>
                        <p className="text-neutral-700">
                            By accessing and using the website, you accept and agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">2. changes to terms</h2>
                        <p className="text-neutral-700">
                            Fantastic AI Studio (FAIS) reserves the right to revise and update these Terms of Use at any time. Your continued use of the site after any changes signifies your acceptance of the new terms.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">3. use of the website</h2>
                        <p className="text-neutral-700">
                            You agree to use the website for lawful purposes only. You are prohibited from using the site in a way that could damage, disable, overburden, or impair any FAIS server, or the network(s) connected to any FAIS server, or interfere with any other party's use and enjoyment of the website.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">4. intellectual property</h2>
                        <p className="text-neutral-700">
                            All content on this website, including but not limited to text, graphics, logos, and software, is the property of FAIS or its content suppliers and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any of the material on this site without the prior written consent of FAIS.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">5. user content</h2>
                        <p className="text-neutral-700">
                            You retain ownership of any content you post on the website, but you grant FAIS a worldwide, non-exclusive, royalty-free license to use, distribute, reproduce, modify, adapt, publish, translate, publicly perform, and publicly display such content.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">6. privacy policy</h2>
                        <p className="text-neutral-700">
                            Your use of the website is also subject to FAIS's Privacy Policy. Please review our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>, which also governs the site and informs users of our data collection practices.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">7. disclaimers</h2>
                        <p className="text-neutral-700">
                            The website and its content are provided on an "as is" and "as available" basis. FAIS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">8. limitation of liability</h2>
                        <p className="text-neutral-700">
                            In no event shall FAIS, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the website; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; (iii) any interruption or cessation of transmission to or from the website; (iv) any bugs, viruses, trojan horses, or the like that may be transmitted to or through our website by any third party.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">9. governing law</h2>
                        <p className="text-neutral-700">
                            These Terms of Use are governed by and construed in accordance with the laws of Ukraine, without regard to its conflict of law principles.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">10. contact information</h2>
                        <p className="text-neutral-700 mb-4">
                            If you have any questions about these Terms of Use, please contact us at:
                        </p>
                        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                            <p className="text-neutral-700 mb-2">
                                <strong>Yevheniy Lukyanov</strong>
                            </p>
                            <p className="text-neutral-700 mb-2">
                                <strong>Email:</strong> info@fais.world
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