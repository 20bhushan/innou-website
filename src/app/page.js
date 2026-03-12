"use client";

import { useEffect } from "react";

import ThreeCanvas from "@/components/three/ThreeCanvas";
import initDomEffects from "@/components/three/DomEffects";

import Loader from "@/components/sections/Loader";
import Hero from "@/components/sections/Hero";
import Events from "@/components/sections/Events";
import About from "@/components/sections/About";
import Competitions from "@/components/sections/Competitions";
import Schedule from "@/components/sections/Schedule";
import Sponsors from "@/components/sections/Sponsors";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

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
      {/* Main Sections */}
      <Hero />
      <Events />
      <About />
      <Competitions marquee />
      <Schedule />
      <Sponsors />
      <Contact />

      {/* Footer */}
      <Footer />

      {/* Cursor Glow */}
      <div className="cursor-glow"></div>
    </>
  );
}
