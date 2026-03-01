"use client";

import { useEffect, useRef } from "react";
import CoreEngine from "./CoreEngine";

export default function Engine() {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!engineRef.current) {
      engineRef.current = new CoreEngine(containerRef.current);
      window.__ENGINE__ = engineRef.current;
    }
  }, []);

  return <div id="canvas-container" ref={containerRef} />;
}
