import Link from "next/link";
import { ShieldCheck, ArrowRight, HelpCircle, PhoneCall, FileText } from "lucide-react";
import styles from "./Warranty.module.css";

export const metadata = {
  title: "Warranty Policy | Innoverse Technologies",
  description: "Read the warranty terms and conditions of Innoverse Technologies. Learn about manufacturer warranty claims, return shipping, and coverage exclusions.",
};

export default function WarrantyPolicyPage() {
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
          <span className="breadcrumb__current">Warranty Policy</span>
        </li>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Warranty Policy</h1>
        <p className={styles.subtitle}>
          Understand the coverage, exclusions, and claims process for manufacturer warranties on products purchased from Innoverse Technologies.
        </p>
      </header>

      {/* Main Layout */}
      <div className={styles.layout}>
        <main className={styles.contentBlock}>
          {/* Summary Box */}
          <div className={styles.summaryBox}>
            <p>
              <strong>In short:</strong> Products with a manufacturer warranty are covered against genuine defects for the period listed on the product page. If something goes wrong within that period, contact us and we'll get it repaired or replaced — return shipping is at your own expense. This is separate from our Return Policy, which covers issues caught at the point of delivery.
            </p>
          </div>

          {/* Section 1 */}
          <section className={styles.section} id="whats-covered">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>01.</span>
              <h2 className={styles.sectionTitle}>What's Covered</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>Manufacturing defects:</strong> The product stops working, or doesn't work as intended, under normal and standard use.
                </li>
                <li className={styles.listItem}>
                  Coverage applies for the warranty period listed on that specific product's page — warranty length and terms vary by product, so always check the product page for the exact duration and conditions.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className={styles.section} id="whats-not-covered">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>02.</span>
              <h2 className={styles.sectionTitle}>What's Not Covered</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>Physical damage from drops, pressure, or impact.</li>
                <li className={styles.listItem}>Water/liquid damage, unless the product is specifically rated for water resistance and the damage falls within that rating.</li>
                <li className={styles.listItem}>Normal wear and tear (e.g., battery capacity naturally declining over time, cosmetic scuffs).</li>
                <li className={styles.listItem}>Damage from misuse, unauthorized repairs, or modifications by anyone other than an authorized service provider.</li>
                <li className={styles.listItem}>Damage caused by third-party accessories or chargers not recommended for the product.</li>
                <li className={styles.listItem}>Loss or theft of the product.</li>
                <li className={styles.listItem}>Claims without a valid order number or proof of purchase.</li>
                <li className={styles.listItem}>
                  Anything already excluded under our{" "}
                  <Link href="/return-policy" className={styles.link}>Return Policy §2</Link> (e.g., change of mind).
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section} id="manufacturer-vs-support">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>03.</span>
              <h2 className={styles.sectionTitle}>Manufacturer Warranty vs. Our Support</h2>
            </div>
            <div className={styles.text}>
              <p>
                Depending on the product, your warranty claim may be handled in one of two ways:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>Directly by us:</strong> We manage the repair or replacement process on your behalf with the supplier.
                </li>
                <li className={styles.listItem}>
                  <strong>Through the manufacturer's authorized service center:</strong> We'll point you to the right place and support you through the process.
                </li>
              </ul>
              <p>
                Which protocol applies to your product will be noted on the product page and in your order confirmation.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section} id="return-shipping">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>04.</span>
              <h2 className={styles.sectionTitle}>Return Shipping</h2>
            </div>
            <div className={styles.text}>
              <p>
                Return shipping for warranty claims is the customer's responsibility. This is different from an at-delivery return (see our{" "}
                <Link href="/return-policy" className={styles.link}>Return Policy §1</Link>
                ), where a damaged, defective, or wrong item is handled at no cost to you because the issue is caught before you accept the delivery.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section} id="how-resolved">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>05.</span>
              <h2 className={styles.sectionTitle}>How Claims Are Resolved</h2>
            </div>
            <div className={styles.text}>
              <p>
                Warranty claims are typically resolved through repair or replacement first.
              </p>
              <p>
                A refund is only issued if neither repair nor replacement is possible, following the same refund process and timeline as our{" "}
                <Link href="/return-policy" className={styles.link}>Return Policy §5</Link>{" "}
                (7 business days, to your original payment method for BanglaQR orders, or as store credit/bank transfer for Cash on Delivery orders).
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section} id="how-to-start">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>06.</span>
              <h2 className={styles.sectionTitle}>How to Start a Warranty Claim</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  Contact us at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> (phone or WhatsApp) or{" "}
                  <a href="mailto:support@innoversely.com" className={styles.link}>support@innoversely.com</a> with your order number and a description of the issue — a photo or short video of the fault helps us assess it faster.
                </li>
                <li className={styles.listItem}>
                  We'll confirm whether the issue is covered, and whether it's handled by us directly or the manufacturer's service center.
                </li>
                <li className={styles.listItem}>
                  You'll arrange return shipping to the relevant address; we'll confirm resolution timelines once the item is received and inspected.
                </li>
              </ul>
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
            Last updated: {currentDate}. This policy may be updated from time to time; the version shown on our website at the time of your order applies to that order.
          </p>
        </main>
      </div>
    </div>
  );
}
