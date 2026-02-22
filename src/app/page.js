"use client";

import { useEffect } from "react";

import ThreeCanvas from "@/components/three/ThreeCanvas";
import initDomEffects from "@/components/three/DomEffects";

import Loader from "@/components/sections/Loader";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Events from "@/components/sections/Events";
import About from "@/components/sections/About";
import Competitions from "@/components/sections/Competitions";
import Schedule from "@/components/sections/Schedule";
import Sponsors from "@/components/sections/Sponsors";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import RegisterModal from "@/components/sections/RegisterModal";

export default function Home() {
  useEffect(() => {
    initDomEffects();
  }, []);

  return (
    <>
      {/* 3D Background Engine */}
      <ThreeCanvas />

      {/* Loader */}
      <Loader />

      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <Hero />
      <Events />
      <About />
      <Competitions />
      <Schedule />
      <Sponsors />
      <Contact />

      {/* Footer */}
      <Footer />

      {/* Modal */}
      <RegisterModal />

      {/* Cursor Glow */}
      <div className="cursor-glow"></div>
    </>
  );
}
