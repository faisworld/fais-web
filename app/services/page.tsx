import Link from "next/link";

export const metadata = {
  title: "AI & Blockchain Services | Fantastic AI Studio",
  description: "Discover our comprehensive suite of AI and blockchain services designed to empower your business with innovation, efficiency, and security.",
  keywords: [
    "AI services",
    "blockchain solutions",
    "machine learning",
    "smart contracts",
    "predictive analytics",
    "NLP",
    "computer vision",
    "decentralized applications",
    "tokenization",
    "enterprise AI",
    "Fantastic AI Studio"
  ],
  openGraph: {
    title: "AI & Blockchain Services | Fantastic AI Studio",
    description: "Explore our professional AI and blockchain solutions tailored to your business needs.",
    url: "https://fais.world/services",
    images: [
      {
        url: "/services-hero-placeholder.png",
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio Services"
      }
    ]
  }
};

export default function ServicesPage() {
  return (
    <div className="relative overflow-x-clip">
      {/* Glow balls or background gradients */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-gradient-to-br from-fuchsia-400 via-pink-300 to-yellow-200 opacity-40 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-gradient-to-br from-yellow-200 via-orange-300 to-pink-400 opacity-30 blur-3xl" />
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900 drop-shadow-glow">
              Professional AI & Blockchain Services
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-neutral-700 max-w-3xl mx-auto">
              Unlock the full potential of your business with innovative, secure, and scalable solutions powered by artificial intelligence and blockchain technology.
            </p>
            {/* Image Placeholder */}
            <div className="flex justify-center mb-10">
              <div className="w-full max-w-2xl h-64 bg-neutral-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-300 shadow-lg">
                <span className="text-neutral-400 text-lg">[Image Placeholder]</span>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-gradient-to-r from-fuchsia-500 via-pink-400 to-yellow-300 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Book a Free Consultation
            </Link>
          </div>
        </section>

        {/* Services Overview */}
        <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16">
          {/* AI Services */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-neutral-100 backdrop-blur">
            <h2 className="text-3xl font-bold mb-4 text-fuchsia-600 drop-shadow-glow">Artificial Intelligence Solutions</h2>
            <p className="mb-6 text-neutral-700">
              Leverage advanced AI to transform your operations, drive innovation, and gain actionable insights. Our AI services are tailored to solve real business challenges and deliver measurable results.
            </p>
            <ul className="space-y-4 text-neutral-800">
              <li>
                <strong>Predictive Analytics:</strong> Anticipate trends, customer behaviors, and market shifts with data-driven forecasting models.
              </li>
              <li>
                <strong>Natural Language Processing (NLP):</strong> Enable intelligent automation of text and voice data for chatbots, sentiment analysis, and content summarization.
              </li>
              <li>
                <strong>Computer Vision:</strong> Automate image and video analysis for quality control, security, and enhanced user experiences.
              </li>
              <li>
                <strong>Custom Machine Learning Models:</strong> Develop and deploy models tailored to your unique business needs, from automation to optimization.
              </li>
              <li>
                <strong>AI-Powered Chatbots & Virtual Assistants:</strong> Enhance customer engagement and support with 24/7 intelligent conversational agents.
              </li>
              <li>
                <strong>Robotic Process Automation (RPA):</strong> Streamline repetitive tasks and workflows, reducing costs and minimizing errors.
              </li>
            </ul>
          </div>

          {/* Blockchain Solutions */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-neutral-100 backdrop-blur">
            <h2 className="text-3xl font-bold mb-4 text-yellow-500 drop-shadow-glow">Blockchain & Web3 Solutions</h2>
            <p className="mb-6 text-neutral-700">
              Harness the power of decentralized technology to build secure, transparent, and future-ready applications. Our blockchain services help you innovate with confidence.
            </p>
            <ul className="space-y-4 text-neutral-800">
              <li>
                <strong>Smart Contract Development:</strong> Automate agreements and transactions with secure, self-executing contracts on leading blockchain platforms.
              </li>
              <li>
                <strong>Decentralized Applications (DApps):</strong> Build scalable, censorship-resistant apps that empower users and enhance data security.
              </li>
              <li>
                <strong>Tokenization & Digital Assets:</strong> Digitize real-world assets for improved liquidity, fractional ownership, and streamlined management.
              </li>
              <li>
                <strong>Enterprise Blockchain Integration:</strong> Seamlessly connect blockchain with your existing systems (ERP, CRM, SCM) for enhanced transparency and efficiency.
              </li>
              <li>
                <strong>Consulting & Strategy:</strong> Receive expert guidance on blockchain adoption, platform selection, and roadmap development for successful implementation.
              </li>
              <li>
                <strong>Security Audits & Compliance:</strong> Ensure your blockchain solutions meet the highest standards for security and regulatory compliance.
              </li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-fuchsia-500 via-pink-400 to-yellow-300 py-16 text-center text-white shadow-inner">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-glow">Ready to Transform Your Business?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Partner with Fantastic AI Studio to unlock new opportunities, streamline operations, and stay ahead of the competition with our expert AI and blockchain services.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white/90 text-fuchsia-700 font-semibold rounded-lg shadow-lg hover:bg-white transition"
          >
            Get Started Today
          </Link>
        </section>
      </main>
    </div>
  );
}