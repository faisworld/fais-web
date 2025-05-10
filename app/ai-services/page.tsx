import Link from "next/link";

export const metadata = {
  title: "AI Solutions | Fantastic AI Studio",
  description: "Discover our innovative AI solutions including predictive analytics, NLP, computer vision, and custom machine learning models to transform your business.",
  keywords: [
    "AI services",
    "predictive analytics",
    "natural language processing",
    "NLP",
    "computer vision",
    "machine learning models",
    "AI chatbots",
    "robotic process automation",
    "RPA",
    "recommendation systems",
    "speech recognition",
    "data analytics",
    "AI cybersecurity",
    "Fantastic AI Studio"
  ],
  openGraph: {
    title: "AI Solutions | Fantastic AI Studio",
    description: "Enhance operational efficiency and drive data-driven decision-making with our innovative AI solutions.",
    url: "https://fais.world/ai-services",
    images: [
      {
        url: "/ai-services-hero-placeholder.png",
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio AI Solutions"
      }
    ]
  }
};

export default function AIServicesPage() {
  return (
    <div className="relative overflow-x-clip">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-neutral-200 opacity-40 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-neutral-200 opacity-30 blur-3xl" />
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900">
              {"{ai}"} solutions by fAi{"{s}"}tudio
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-neutral-700 max-w-3xl mx-auto">
              at fantastic ai studio, we provide a diverse range of artificial intelligence solutions tailored to meet the unique needs of businesses and corporations.
            </p>
            {/* Image Placeholder */}
            <div className="flex justify-center mb-10">
              <div className="w-full max-w-2xl h-64 bg-neutral-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-300 shadow-lg">
                <span className="text-neutral-400 text-lg">[ai solutions image]</span>
              </div>
            </div>
            <p className="text-lg mb-10 text-neutral-700 max-w-3xl mx-auto">
              our innovative ai services are designed to enhance operational efficiency, drive data-driven decision-making, and foster intelligent automation.
            </p>
            <Link
              href="/contact"
              className="btn inline-block px-8 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-black hover:text-white hover:opacity-90 transition"
            >
              schedule an ai consultation
            </Link>
          </div>
        </section>

        {/* AI Services Overview */}
        <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16">
          {/* Core AI Services */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-neutral-100 backdrop-blur">
            <h2 className="text-3xl font-bold mb-4 text-black">core ai services</h2>
            <p className="mb-6 text-neutral-700">
              our comprehensive ai solutions help businesses leverage cutting-edge technology to gain insights, automate processes, and make data-driven decisions.
            </p>
            <ul className="space-y-4 text-neutral-800">
              <li>
                <strong>predictive analytics:</strong> harness the power of ai to predict future trends and behaviors, enabling proactive decision-making. analyze historical data to forecast outcomes and identify potential opportunities and risks.
              </li>
              <li>
                <strong>natural language processing (nlp):</strong> enhance your applications with nlp capabilities that allow systems to understand, interpret, and respond to human language. includes sentiment analysis, chatbots, and language translation.
              </li>
              <li>
                <strong>computer vision:</strong> leverage ai to interpret and understand visual data. applications include image recognition, facial recognition, and video analysis for security, quality control, and automation.
              </li>
              <li>
                <strong>machine learning models:</strong> develop and deploy custom machine learning models tailored to your business needs. automate tasks, optimize processes, and gain actionable insights from large datasets.
              </li>
              <li>
                <strong>ai-powered chatbots:</strong> improve customer engagement and support with ai-powered chatbots that provide instant responses and solutions. designed to understand and interact with users naturally, enhancing the customer experience.
              </li>
            </ul>
          </div>

          {/* Advanced AI Solutions */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-neutral-100 backdrop-blur">
            <h2 className="text-3xl font-bold mb-4 text-black">advanced ai solutions</h2>
            <p className="mb-6 text-neutral-700">
              leverage our expertise in specialized ai technologies to address complex business challenges and create innovative solutions for your organization.
            </p>
            <ul className="space-y-4 text-neutral-800">
              <li>
                <strong>robotic process automation (rpa):</strong> automate repetitive tasks and streamline business processes with rpa. rpa bots handle high-volume, rule-based tasks, reducing operational costs and increasing efficiency.
              </li>
              <li>
                <strong>recommendation systems:</strong> personalize user experiences with ai-driven recommendation systems that analyze user behavior and preferences to provide customized product, service, or content recommendations.
              </li>
              <li>
                <strong>speech recognition:</strong> integrate advanced speech recognition technology for hands-free operation and enhanced accessibility. supports voice commands, transcription, and voice authentication.
              </li>
              <li>
                <strong>data analytics and visualization:</strong> transform raw data into meaningful insights. provide comprehensive data analysis and create interactive visual dashboards to support informed decision-making.
              </li>
              <li>
                <strong>ai for cybersecurity:</strong> enhance cybersecurity measures with ai-driven solutions that detect and respond to threats in real-time. monitor network traffic, identify anomalies, and mitigate risks to protect digital assets.
              </li>
            </ul>
          </div>
        </section>

        {/* Industry Applications */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold mb-12 text-center">ai across industries</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Healthcare */}
            <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-neutral-100">
              <h3 className="text-2xl font-bold mb-3 text-black">healthcare</h3>
              <p className="text-neutral-700 mb-4">
                Transform patient care, diagnostics, and healthcare operations with AI-powered solutions that enhance accuracy and efficiency.
              </p>
              <ul className="text-neutral-800 space-y-2 list-disc pl-5">
                <li>Medical image analysis</li>
                <li>Patient outcome prediction</li>
                <li>Treatment personalization</li>
                <li>Administrative automation</li>
              </ul>
            </div>

            {/* Retail & E-Commerce */}
            <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-neutral-100">
              <h3 className="text-2xl font-bold mb-3 text-black">retail & e-commerce</h3>
              <p className="text-neutral-700 mb-4">
                Enhance customer experiences and optimize operations with AI-driven personalization, forecasting, and inventory management.
              </p>
              <ul className="text-neutral-800 space-y-2 list-disc pl-5">
                <li>Personalized recommendations</li>
                <li>Demand forecasting</li>
                <li>Visual search capabilities</li>
                <li>Inventory optimization</li>
              </ul>
            </div>

            {/* Finance */}
            <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-neutral-100">
              <h3 className="text-2xl font-bold mb-3 text-black">finance & banking</h3>
              <p className="text-neutral-700 mb-4">
                Strengthen security, improve customer service, and optimize financial operations with AI-powered analytics and automation.
              </p>
              <ul className="text-neutral-800 space-y-2 list-disc pl-5">
                <li>Fraud detection & prevention</li>
                <li>Algorithmic trading</li>
                <li>Credit risk assessment</li>
                <li>Personalized financial advice</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-neutral-100 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">why fAi{"{s}"}tudio?</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-2">expertise & experience</h3>
                <p className="text-neutral-700">
                  Our team of AI specialists combines deep technical knowledge with years of industry experience to deliver superior solutions.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-2">customized approach</h3>
                <p className="text-neutral-700">
                  We tailor our AI solutions to address your specific business challenges and objectives, ensuring maximum impact and ROI.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-2">cutting-edge technology</h3>
                <p className="text-neutral-700">
                  We stay at the forefront of AI innovation, utilizing the latest frameworks, models, and techniques to deliver state-of-the-art solutions.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-2">end-to-end support</h3>
                <p className="text-neutral-700">
                  From initial consultation to deployment and ongoing maintenance, we provide comprehensive support throughout your AI journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Process */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold mb-12 text-center">our ai implementation process</h2>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-2 text-center">discovery</h3>
              <p className="text-neutral-700 text-center">
                We analyze your business needs and identify AI opportunities.
              </p>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-neutral-300 -z-10"></div>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-2 text-center">data assessment</h3>
              <p className="text-neutral-700 text-center">
                We evaluate your data infrastructure and prepare datasets.
              </p>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-neutral-300 -z-10"></div>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-2 text-center">solution design</h3>
              <p className="text-neutral-700 text-center">
                We architect custom AI solutions tailored to your requirements.
              </p>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-neutral-300 -z-10"></div>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-bold mb-2 text-center">development</h3>
              <p className="text-neutral-700 text-center">
                We build, train, and validate your AI models and systems.
              </p>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-neutral-300 -z-10"></div>
            </div>

            <div>
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">5</div>
              <h3 className="text-xl font-bold mb-2 text-center">deployment</h3>
              <p className="text-neutral-700 text-center">
                We integrate AI into your workflows with ongoing support.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-neutral-200 py-16 text-center shadow-inner">
          <h2 className="text-4xl font-bold mb-4">ready to harness the power of ai?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-neutral-700">
            partner with fantastic ai studio to transform your business with innovative ai solutions. our expert team is dedicated to delivering top-tier ai technologies that drive innovation and efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn inline-block px-8 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-black hover:text-white hover:opacity-90 transition"
            >
              schedule a consultation
            </Link>
            <Link
              href="/services"
              className="btn inline-block px-8 py-3 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition"
            >
              explore all services
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
