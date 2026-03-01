"use client";

import { useEffect, useRef } from "react";
import Engine from "./CoreEngine";

export default function ThreeCanvas() {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (engineRef.current) return;

    engineRef.current = new Engine(containerRef.current);

    // expose for theme sync
    window.__ENGINE__ = engineRef.current;
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none", // important
      }}
    />
  );
}
