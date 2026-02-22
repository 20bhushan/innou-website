import { projectMeta } from "@/config/projectMeta";
import {
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>INNOU 1.0</h3>
        <p>© {projectMeta.maintainedYear} All Rights Reserved</p>
        <p style={{ fontSize: "12px", opacity: 0.6 }}>v{projectMeta.version}</p>
        <div className="social-icons">
          <a href="https://www.facebook.com/profile.php?id=61587525647514">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/innou_official/">
            <FaInstagram />
          </a>

          <a href="#">
            <FaXTwitter />
          </a>

          <a href="mailto:innoujgc@gmail.com">
            <FaEnvelope />
          </a>

          <a href="https://wa.me/917628809185">
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  );
}
