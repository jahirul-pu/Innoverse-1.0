"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { 
  ShieldCheck, 
  Banknote, 
  Lock, 
  Truck, 
  RotateCcw 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className={styles.footer} id="site-footer">
      {/* Main Footer Content */}
      <div className={styles.footer__main}>
        {/* Brand Column */}
        <div className={styles.footer__brand}>
          <Link href="/" className={styles.footer__logo}>
            <div className={styles["footer__logo-icon"]}>I</div>
            <div className={styles["footer__logo-text"]}>
              Inno<span>verse</span>
            </div>
          </Link>
          <p className={styles.footer__description}>
            Your trusted source for authentic gadgets and electronics in
            Bangladesh. Quality products, honest pricing, reliable delivery.
          </p>
          <div className={styles.footer__socials}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles["footer__social-link"]}
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles["footer__social-link"]}
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles["footer__social-link"]}
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff" />
              </svg>
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles["footer__social-link"]}
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Shop Column */}
        <div className={styles.footer__column}>
          <h3 className={styles["footer__column-title"]}>Shop</h3>
          <Link href="/category/audio" className={styles.footer__link}>Audio</Link>
          <Link href="/category/smart-home" className={styles.footer__link}>Smart Home</Link>
          <Link href="/category/wearables" className={styles.footer__link}>Wearables</Link>
          <Link href="/category/accessories" className={styles.footer__link}>Accessories</Link>
          <Link href="/deals" className={styles.footer__link}>Deals & Offers</Link>
          <Link href="/new-arrivals" className={styles.footer__link}>New Arrivals</Link>
        </div>

        {/* Support Column */}
        <div className={styles.footer__column}>
          <h3 className={styles["footer__column-title"]}>Support</h3>
          <Link href="/contact" className={styles.footer__link}>Contact Us</Link>
          <Link href="/faq" className={styles.footer__link}>FAQ</Link>
          <Link href="/return-policy" className={styles.footer__link}>Return Policy</Link>
          <Link href="/warranty" className={styles.footer__link}>Warranty Policy</Link>
          <Link href="/payment-policy" className={styles.footer__link}>Payment Policy</Link>
          <Link href="/shipping" className={styles.footer__link}>Shipping Info</Link>
        </div>

        {/* Company Column */}
        <div className={styles.footer__column}>
          <h3 className={styles["footer__column-title"]}>Company</h3>
          <Link href="/about" className={styles.footer__link}>About Us</Link>
          <Link href="/terms" className={styles.footer__link}>Terms & Conditions</Link>
          <Link href="/privacy" className={styles.footer__link}>Privacy Policy</Link>
          <Link href="/cookie-policy" className={styles.footer__link}>Cookie Policy</Link>
          <Link href="/sitemap" className={styles.footer__link}>Sitemap</Link>
        </div>

        {/* Track Order Column */}
        <div className={styles.footer__track}>
          <h3 className={styles["footer__column-title"]}>Track Your Order</h3>
          <p className={styles.footer__description}>
            Enter your tracking number to check delivery status — no login required.
          </p>
          <form className={styles["footer__track-form"]} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className={styles["footer__track-input"]}
              placeholder="Tracking number"
              aria-label="Tracking number"
              id="footer-tracking-input"
            />
            <button type="submit" className={styles["footer__track-btn"]} id="footer-track-btn">
              Track
            </button>
          </form>
        </div>
      </div>

      {/* Trust Strip */}
      <div className={styles.footer__trust}>
        <div className={styles["footer__trust-inner"]}>
          <div className={styles["footer__trust-item"]}>
            <span className={styles["footer__trust-icon"]}><ShieldCheck size={18} /></span>
            Authentic Products
          </div>
          <div className={styles["footer__trust-item"]}>
            <span className={styles["footer__trust-icon"]}><Banknote size={18} /></span>
            Cash on Delivery
          </div>
          <div className={styles["footer__trust-item"]}>
            <span className={styles["footer__trust-icon"]}><Lock size={18} /></span>
            Secure Payment
          </div>
          <div className={styles["footer__trust-item"]}>
            <span className={styles["footer__trust-icon"]}><Truck size={18} /></span>
            Nationwide Delivery
          </div>
          <div className={styles["footer__trust-item"]}>
            <span className={styles["footer__trust-icon"]}><RotateCcw size={18} /></span>
            Easy Returns
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.footer__bottom}>
        <div className={styles["footer__bottom-inner"]}>
          <span>© {new Date().getFullYear()} Innoverse Technologies. All rights reserved.</span>
          <div className={styles["footer__bottom-links"]}>
            <Link href="/terms" className={styles["footer__bottom-link"]}>Terms</Link>
            <Link href="/privacy" className={styles["footer__bottom-link"]}>Privacy</Link>
            <Link href="/cookie-policy" className={styles["footer__bottom-link"]}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
