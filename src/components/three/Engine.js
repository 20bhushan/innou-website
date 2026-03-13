"use client";

import { useEffect, useRef } from "react";
import CoreEngine from "./CoreEngine";

export default function Engine() {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isMobile = window.innerWidth < 768;

    if (!engineRef.current) {
      engineRef.current = new CoreEngine(containerRef.current, {
        isMobile,
      });

      window.__ENGINE__ = engineRef.current;
    }
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
      if (window.__ENGINE__) {
        delete window.__ENGINE__;
      }
    };
  }, []);

  return <div id="canvas-container" ref={containerRef} />;
}
