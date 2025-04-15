// Import necessary modules and components
import React from "react";

import HeroSection from "@/components/pages/HeroSection";
import SolutionsSection from "@/components/pages/SolutionsSection";
import ProjectsSection from "@/components/pages/ProjectsSection";
import TestimonialsSection from "@/components/pages/TestimonialsSection";
import ContactUs from "@/components/pages/ContactUs";
import PreFooterSection from "@/components/pages/PreFooterSection";

// Define the main Home component
export default function Home() {
  const carouselItems = [
    {
      src: "/images/pioneering-digital-transformation.webp",
      alt: "Pioneering Digital Transformation",
      title: "Pioneering Digital Transformation",
      subtitle: "Driving Innovation, Empowering Change", // Recommended subtitle
      description: "Being at the forefront of digital revolutions delivering powerful, integrated solutions for your growth and success",
      x: "50%",
      y: "50%",
      backgroundColor: "rgba(255, 252, 252, 0.5)",
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
      subtitle: "Crafting Tomorrow's Solutions", // Recommended subtitle
      description: "Dive into the world of advanced AI and blockchain solutions, and explore tailor-made technologies shaping a sustainable digital future.",
      x: "50%",
      y: "50%",
      backgroundColor: "rgba(255, 252, 252, 0.5)",
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
      subtitle: "Innovating Beyond Boundaries", // Recommended subtitle
      description: "Leveraging cutting-edge AI and Blockchain technologies for smarter solutions across industries.",
      x: "50%",
      y: "50%",
      backgroundColor: "rgba(255, 252, 252, 0.5)",
      backgroundOpacity: 0.7,
      border: "0px solid white",
      backgroundWidth: "500px",
      backgroundHeight: "200px",
      borderRadius: "10px",
    },
  ];

  return (
    <>
      {/* HeroSection will now be at the very top, under the fixed Header */}
      <HeroSection
        carouselItems={carouselItems}
        config={{ autoplay: true, interval: 5000 }}
      />

      {/* The rest of the page sections */}
      <div className="bg-white"> {/* Example wrapper for subsequent sections if needed */}
        <SolutionsSection />
        <ProjectsSection />
        <TestimonialsSection />
        <ContactUs />
        <PreFooterSection />
      </div>
    </>
  );
}
