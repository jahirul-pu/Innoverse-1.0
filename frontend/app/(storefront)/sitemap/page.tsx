import Link from "next/link";
import { HelpCircle, PhoneCall, FileText, ArrowRight, Home, Globe } from "lucide-react";
import styles from "./Sitemap.module.css";

export const metadata = {
  title: "Sitemap | Innoverse Technologies",
  description: "Browse all pages, policy sheets, and support sections available on the Innoverse Technologies storefront.",
};

export default function SitemapPage() {
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">Home</Link>
        </li>
        <li className="breadcrumb__item">
          <span className="breadcrumb__current">Sitemap</span>
        </li>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Sitemap</h1>
        <p className={styles.subtitle}>
          A complete index of all pages, policy documentations, and customer support channels on Innoverse Technologies.
        </p>
      </header>

      {/* Main Layout */}
      <div className={styles.layout}>
        <div className={styles.sitemapGrid}>
          {/* Main Pages */}
          <div className={styles.categoryBlock}>
            <h2 className={styles.categoryTitle}>Main Sections</h2>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link href="/" className={styles.pageLink}>
                  <Home size={16} /> Home Page
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/about" className={styles.pageLink}>
                  <ArrowRight size={14} /> About Us
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/contact" className={styles.pageLink}>
                  <PhoneCall size={16} /> Contact Support
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/faq" className={styles.pageLink}>
                  <HelpCircle size={16} /> FAQ (Frequently Asked Questions)
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Pages */}
          <div className={styles.categoryBlock}>
            <h2 className={styles.categoryTitle}>Company Policies</h2>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link href="/shipping" className={styles.pageLink}>
                  <FileText size={16} /> Shipping & Delivery Info
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/return-policy" className={styles.pageLink}>
                  <FileText size={16} /> Return Policy
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/warranty" className={styles.pageLink}>
                  <FileText size={16} /> Warranty Policy
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/payment-policy" className={styles.pageLink}>
                  <FileText size={16} /> Payment Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className={styles.categoryBlock}>
            <h2 className={styles.categoryTitle}>Legal Documentation</h2>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link href="/terms" className={styles.pageLink}>
                  <FileText size={16} /> Terms and Conditions
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/privacy" className={styles.pageLink}>
                  <FileText size={16} /> Privacy Policy
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/cookie-policy" className={styles.pageLink}>
                  <FileText size={16} /> Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* XML sitemap */}
          <div className={styles.categoryBlock}>
            <h2 className={styles.categoryTitle}>Search Engine Index</h2>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <a href="/sitemap.xml" className={styles.pageLink} target="_blank" rel="noopener noreferrer">
                  <Globe size={16} /> XML Sitemap (for search engines)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.navRow}>
          <Link href="/faq" className={styles.navLink}>
            <HelpCircle size={16} /> Read FAQ <ArrowRight size={14} />
          </Link>
          <Link href="/contact" className={styles.navLink}>
            <PhoneCall size={16} /> Contact Support <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
