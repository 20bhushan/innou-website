"use client";

import { usePathname } from "next/navigation";
import Engine from "./Engine";

export default function BackgroundController() {
  const pathname = usePathname();

  // Pages where background should appear
  const allowedPages = ["/"];

  if (!allowedPages.includes(pathname)) {
    return null;
  }

  return <Engine />;
}
