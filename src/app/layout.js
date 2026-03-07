import "./globals.css";
import "../css/events.css";
import "../css/rules.css";
import BackgroundController from "@/components/three/BackgroundController";
import Navbar from "@/components/sections/Navbar.js";
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
      <head>
        {/* Google Font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>

      <body>
        {/* Smart Background Controller */}
        <BackgroundController />
        {/* Navbar Always Visible */}
        <Navbar />

        {children}
      </body>
    </html>
  );
}
