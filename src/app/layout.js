import "./globals.css";
import "../css/events.css";
import "../css/rules.css";
import BackgroundController from "@/components/three/BackgroundController";
import Navbar from "@/components/sections/Navbar.js";
import NoticeBar from "@/components/common/NoticeBar";
export const metadata = {
  title: "INNOU 1.0 | 2026",
  icons: {
    icon: "/favIcon.png",
  },
  description: "INNOU Tech Fest Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Smart Background Controller */}
        <BackgroundController />
        {/* Navbar Always Visible */}
        <Navbar />
            <NoticeBar />
        {children}
      </body>
    </html>
  );
}
