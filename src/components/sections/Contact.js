"use client";

import {
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Contact() {
  return (
    <section id="contact" className="tracks reveal">
      <h2 className="section-title">Contact Us</h2>

      <div className="track-card contact-card">
        <p>innou.in</p>
        <p>+91 76288 09185</p>

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
    </section>
  );
}
