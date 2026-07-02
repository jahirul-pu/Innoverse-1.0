import Link from "next/link";
import { HelpCircle, PhoneCall, FileText, ArrowRight } from "lucide-react";
import styles from "./CookiePolicy.module.css";

export const metadata = {
  title: "Cookie Policy | Innoverse Technologies",
  description: "Read the Cookie Policy of Innoverse Technologies. Learn what cookies we use, why we use them, and how to manage your cookie preferences.",
};

export default function CookiePolicyPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">Home</Link>
        </li>
        <li className="breadcrumb__item">
          <span className="breadcrumb__current">Cookie Policy</span>
        </li>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Cookie Policy</h1>
        <p className={styles.subtitle}>
          Understand how Innoverse Technologies uses cookies to provide a better browsing experience.
        </p>
      </header>

      {/* Main Layout */}
      <div className={styles.layout}>
        <main className={styles.contentBlock}>
          {/* Summary Box */}
          <div className={styles.summaryBox}>
            <p>
              <strong>In short:</strong> We use a small number of cookies to make the site work — keeping your cart, login, and dark/light mode preference intact — plus basic analytics to understand how the site is used. We don't currently use advertising or tracking cookies.
            </p>
          </div>

          {/* Section 1 */}
          <section className={styles.section} id="what-are-cookies">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>01.</span>
              <h2 className={styles.sectionTitle}>What Are Cookies?</h2>
            </div>
            <div className={styles.text}>
              <p>
                Cookies are small text files stored on your device when you visit a website. They help the site remember information about your visit — like what's in your cart, or whether you prefer dark or light mode — so you don't have to re-enter it every time.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className={styles.section} id="cookies-we-use">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>02.</span>
              <h2 className={styles.sectionTitle}>Cookies We Use</h2>
            </div>
            <div className={styles.text}>
              <h3>Strictly Necessary</h3>
              <p>These are required for the website to function and can't be switched off:</p>
              <ul className={styles.list}>
                <li className={styles.listItem}>Keeping items in your cart as you browse.</li>
                <li className={styles.listItem}>Keeping you logged in during a session, if you have an account.</li>
                <li className={styles.listItem}>Remembering your dark/light mode preference.</li>
                <li className={styles.listItem}>Supporting checkout and basic site security (e.g., preventing fraudulent form submissions).</li>
              </ul>

              <h3 style={{ marginTop: "var(--space-6)" }}>Analytics / Performance</h3>
              <p>
                These help us understand how the site is used, so we can improve it — for example, which pages are visited most, or where people drop off before completing an order. We currently use Google Analytics (GA4) for this. These cookies don't identify you personally.
              </p>

              <h3 style={{ marginTop: "var(--space-6)" }}>Marketing / Advertising</h3>
              <p>
                We do not currently use marketing or advertising cookies (e.g., for retargeting or third-party ad networks). If this changes in the future — for example, as part of personalized product recommendations — this policy will be updated first, and where required, we'll ask for your consent.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section} id="managing-preferences">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>03.</span>
              <h2 className={styles.sectionTitle}>Managing Your Cookie Preferences</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>Essential cookies can't be disabled without affecting core site functionality (like your cart or login).</li>
                <li className={styles.listItem}>Analytics cookies can generally be blocked through your browser's cookie settings, or via a cookie preference tool on this site if one is provided.</li>
                <li className={styles.listItem}>Most browsers let you view, delete, or block cookies through their settings menu — check your browser's help section for instructions specific to it.</li>
              </ul>
              <p style={{ marginTop: "var(--space-4)" }}>
                Blocking cookies may affect how well the site works — for example, your cart may not persist between pages if essential cookies are disabled.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section} id="third-party">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>04.</span>
              <h2 className={styles.sectionTitle}>Third-Party Cookies</h2>
            </div>
            <div className={styles.text}>
              <p>
                Some cookies are set by services we use, not directly by us — currently, this is limited to Google Analytics (GA4). We don't control these third-party cookies directly; please refer to the relevant provider's own policy for details on how they handle data.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section} id="changes">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>05.</span>
              <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
            </div>
            <div className={styles.text}>
              <p>
                We may update this Cookie Policy as our use of cookies changes — for example, if we introduce new analytics tools or marketing features. The version published on the site applies at the time of your visit. Material changes will be reflected in the "Last updated" date below.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section} id="contact">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>06.</span>
              <h2 className={styles.sectionTitle}>Contact Us</h2>
            </div>
            <div className={styles.text}>
              <p>
                Questions about cookies or this policy? Reach us at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> (phone or WhatsApp) or <a href="mailto:support@innoversely.com" className={styles.link}>support@innoversely.com</a>. See also our <Link href="/privacy" className={styles.link}>Privacy Policy</Link> and <Link href="/contact" className={styles.link}>Contact Us</Link> pages.
              </p>
            </div>
          </section>

          {/* Quick Links */}
          <div className={styles.navRow}>
            <Link href="/faq" className={styles.navLink}>
              <HelpCircle size={16} /> Read FAQ <ArrowRight size={14} />
            </Link>
            <Link href="/return-policy" className={styles.navLink}>
              <FileText size={16} /> Return Policy <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className={styles.navLink}>
              <PhoneCall size={16} /> Contact Support <ArrowRight size={14} />
            </Link>
          </div>

          {/* Policy Footer Note */}
          <p style={{ marginTop: "var(--space-8)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: "var(--leading-relaxed)", fontFamily: "var(--font-data)" }}>
            Last updated: {currentDate}. This policy may be updated from time to time; the version shown on our website at the time of your visit applies.
          </p>
        </main>
      </div>
    </div>
  );
}
