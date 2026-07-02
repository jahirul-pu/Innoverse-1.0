import Link from "next/link";
import { ArrowRight, HelpCircle, PhoneCall, FileText } from "lucide-react";
import styles from "./Privacy.module.css";

export const metadata = {
  title: "Privacy Policy | Innoverse Technologies",
  description: "Read the Privacy Policy of Innoverse Technologies. Understand how we collect, store, share, and protect your personal information under the PDPA 2026.",
};

export default function PrivacyPolicyPage() {
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
          <span className="breadcrumb__current">Privacy Policy</span>
        </li>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>
          Understand how Innoverse Technologies handles your data, your privacy rights, and our data protection standards.
        </p>
      </header>

      {/* Main Layout */}
      <div className={styles.layout}>
        <main className={styles.contentBlock}>

          {/* Summary Box */}
          <div className={styles.summaryBox}>
            <p>
              <strong>In short:</strong> We collect the information needed to get your order to you and support you afterward — name, address, phone, and order details. We don't see or store your banking information; BanglaQR payments go directly through your own bank or MFS app. We don't sell your data.
            </p>
          </div>

          {/* Section 1 */}
          <section className={styles.section} id="info-collected">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>01.</span>
              <h2 className={styles.sectionTitle}>Information We Collect</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>Order & delivery details:</strong> Name, delivery address, phone number, and (if you provide it) email address.
                </li>
                <li className={styles.listItem}>
                  <strong>Account information (only if you create an account):</strong> Login credentials, saved addresses, order history, wishlist.
                </li>
                <li className={styles.listItem}>
                  <strong>Order & transaction data:</strong> Items purchased, order value, order status, and communications related to your order (e.g., a warranty claim or support request).
                </li>
                <li className={styles.listItem}>
                  <strong>Payment confirmation:</strong> We receive confirmation that a BanglaQR payment was made and its amount — we do not collect or store your banking PIN, password, OTP, or account details. Those stay between you and your bank/MFS provider.
                </li>
                <li className={styles.listItem}>
                  <strong>Technical data:</strong> Device and browser information, IP address, and cookies — see our Cookie Policy for details.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className={styles.section} id="how-we-use">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>02.</span>
              <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>To process, fulfill, and deliver your order.</li>
                <li className={styles.listItem}>To confirm payment and handle refunds where applicable.</li>
                <li className={styles.listItem}>To provide customer support, and to process returns, exchanges, or warranty claims.</li>
                <li className={styles.listItem}>To send order-related SMS/email updates (confirmation, shipping, delivery).</li>
                <li className={styles.listItem}>To improve our website, catalog, and service based on aggregated usage patterns.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section} id="sharing-info">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>03.</span>
              <h2 className={styles.sectionTitle}>Who We Share Your Information With</h2>
            </div>
            <div className={styles.text}>
              <p>We share only what's necessary to fulfill your order:</p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>Pathao (our delivery partner)</strong> — name, delivery address, phone number, and order details, to deliver your package.
                </li>
                <li className={styles.listItem}>
                  <strong>Our BanglaQR payment partner/bank</strong> — payment confirmation and amount, to process your payment.
                </li>
                <li className={styles.listItem}>
                  <strong>SMS and email service providers</strong> — to send you order updates.
                </li>
              </ul>
              <p>We do not sell your personal data to third parties. We only share what's listed above, and only for the purposes described.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section} id="user-rights">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>04.</span>
              <h2 className={styles.sectionTitle}>Your Rights</h2>
            </div>
            <div className={styles.text}>
              <p>Under Bangladesh's Personal Data Protection Act (PDPA 2026), you generally have the right to:</p>
              <ul className={styles.list}>
                <li className={styles.listItem}>Access the personal data we hold about you.</li>
                <li className={styles.listItem}>Correct inaccurate or outdated information.</li>
                <li className={styles.listItem}>Request deletion of your data, subject to any legal or accounting obligations we have to retain certain records (e.g., order history for tax purposes).</li>
                <li className={styles.listItem}>Withdraw consent for optional uses, such as marketing communications.</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> (phone or WhatsApp) or <a href="mailto:support@innoversely.com" className={styles.link}>support@innoversely.com</a> with your request, and we'll respond within 30 days.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section} id="retention">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>05.</span>
              <h2 className={styles.sectionTitle}>Data Retention</h2>
            </div>
            <div className={styles.text}>
              <p>
                We retain order and account information for as long as needed to fulfill the purposes described above, and as required by applicable tax, accounting, or consumer-protection obligations. If you request deletion of your account, we'll remove what we can while retaining only what we're legally required to keep.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section} id="security">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>06.</span>
              <h2 className={styles.sectionTitle}>Data Security</h2>
            </div>
            <div className={styles.text}>
              <p>
                We use HTTPS encryption across the site and apply reasonable technical and organizational measures to protect your information from unauthorized access, loss, or misuse. As noted above, we never collect or store your banking credentials — BanglaQR payments are handled entirely between you and your own bank or MFS provider.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className={styles.section} id="cookies">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>07.</span>
              <h2 className={styles.sectionTitle}>Cookies</h2>
            </div>
            <div className={styles.text}>
              <p>
                We use cookies to keep the site working properly (e.g., remembering your cart, dark/light mode preference) and, where applicable, for analytics. Full details are in our Cookie Policy.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className={styles.section} id="children">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>08.</span>
              <h2 className={styles.sectionTitle}>Children's Privacy</h2>
            </div>
            <div className={styles.text}>
              <p>
                Innoverse Technologies is intended for use by people 18 or older, or by minors with the involvement of a parent or guardian, consistent with our Terms and Conditions. We don't knowingly collect personal data from children beyond what a guardian provides on their behalf.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className={styles.section} id="changes">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>09.</span>
              <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
            </div>
            <div className={styles.text}>
              <p>
                We may update this Privacy Policy from time to time, particularly as Bangladesh's data protection framework continues to develop. The version published on the site applies at the time of your visit or order. Material changes will be reflected in the "Last updated" date below.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className={styles.section} id="contact">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>10.</span>
              <h2 className={styles.sectionTitle}>Contact Us</h2>
            </div>
            <div className={styles.text}>
              <p>
                Questions about your data or this policy? Reach us at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> (phone or WhatsApp) or <a href="mailto:support@innoversely.com" className={styles.link}>support@innoversely.com</a>. See also our <Link href="/contact" className={styles.link}>Contact Us</Link> page.
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
