"use client";
// Import necessary libraries and components
import "client-only"; // Importing client-only to ensure the component runs on the client side
import { useEffect } from "react"; // Importing useEffect for side effects
import Image from 'next/image';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Importing Inter font from Google Fonts
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
      src: "/images/pioneering-digital-transformation.png",
      alt: "Pioneering Digital Transformation",
      title: "Pioneering Digital Transformation",
      subtitle: "Driving Innovation, Empowering Change",
      description: "Being at the forefront of digital revolutions delivering powerful, integrated solutions for your growth and success",
    },
    {
      src: "/images/Innovating-the-Future-nw.webp",
      alt: "Innovating the Future",
      title: "Innovating the Future",
      subtitle: "Crafting Tomorrow's Solutions",
      description: "Dive into the world of advanced AI and blockchain solutions, and explore tailor-made technologies shaping a sustainable digital future.",
    },
    {
      src: "/images/Shaping-Sota-Technologies.webp",
      alt: "Shaping Sota Technologies",
      title: "Shaping Sota Technologies",
      subtitle: "Innovating Beyond Boundaries",
      description: "Leveraging cutting-edge AI and Blockchain technologies for smarter solutions across industries.",
    },
  ];
  return (
    <>
      {/* Header will be fixed at the top */}
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