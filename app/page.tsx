// Import necessary modules and components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/pages/HeroSection";
import SolutionsSection from "@/components/pages/SolutionsSection";
import QuoteSection from "@/components/pages/QuoteSection";
import AboutSection from "@/components/pages/AboutSection";
import ProjectsSection from "@/components/pages/ProjectsSection";
import PreFooterSection from "@/components/pages/PreFooterSection"; // Import the new component

// Define the main Home component
export default function Home() {
  const carouselItems = [
    {
      src: "/images/pioneering-digital-transformation.webp",
      alt: "Pioneering Digital Transformation",
      title: "Pioneering Digital Transformation",
      subtitle: "Subtitle 1",
      description: "Description 1",
      x: "50%",
      y: "50%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backgroundOpacity: 0.7,
      border: "0px solid white",
      backgroundWidth: "500px",
      backgroundHeight: "200px",
      borderRadius: "10px",
    },
    {
      src: "/images/Innovating-the-Future-nw.webp",
      alt: "Innovating the Future",
      title: "Innovating the Future",
      subtitle: "Subtitle 2",
      description: "Description 2",
      x: "50%",
      y: "50%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backgroundOpacity: 0.7,
      border: "0px solid white",
      backgroundWidth: "500px",
      backgroundHeight: "200px",
      borderRadius: "10px",
    },
    {
      src: "/images/Shaping-Sota-Technologies.webp",
      alt: "Shaping Sota Technologies",
      title: "Shaping Sota Technologies",
      subtitle: "Subtitle 3",
      description: "Description 3",
      x: "50%",
      y: "50%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backgroundOpacity: 0.7,
      border: "0px solid white",
      backgroundWidth: "500px",
      backgroundHeight: "200px",
      borderRadius: "10px",
    },
  ];

  return (
    <>
      <div className="grid grid-rows-[auto_auto_auto] items-center justify-items-center min-h-screen p-0 font-[family-name:var(--font-geist-sans)]">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <HeroSection 
          carouselItems={carouselItems} 
          config={{ autoplay: true, interval: 5000 }} 
        />

        {/* Main Content */}
        <main className="flex flex-col gap-[50px] row-start-2 items-center sm:items-start z-10">
          <SolutionsSection />
          <QuoteSection />
          <AboutSection />
          <ProjectsSection />
        </main>

        {/* Pre-Footer Section */}
        <PreFooterSection /> {/* Add the PreFooterSection here */}
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
