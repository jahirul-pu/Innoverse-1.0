import Link from "next/link";
import { ShieldAlert, ArrowRight, HelpCircle, PhoneCall } from "lucide-react";
import styles from "./ReturnPolicy.module.css";

export const metadata = {
  title: "Return Policy | Innoverse Technologies",
  description: "Read the return, exchange, and warranty policy of Innoverse Technologies. Inspect items in front of delivery agent.",
};

export default function ReturnPolicyPage() {
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
          <span className="breadcrumb__current">Return Policy</span>
        </li>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Return Policy</h1>
        <p className={styles.subtitle}>
          At Innoverse Technologies, we prioritize authenticity and customer satisfaction. Please read our guidelines on order acceptance, exchanges, and warranty claims below.
        </p>
      </header>

      {/* Main Layout */}
      <div className={styles.layout}>
        <main className={styles.contentBlock}>
          {/* Summary Box */}
          <div className={styles.summaryBox}>
            <p>
              <strong>In short:</strong> Inspect your item with the delivery agent before you accept it. If it's damaged, defective, or not what you ordered, hand it back and we'll send you the correct product — no additional delivery charge. Once you've accepted delivery, that window is closed, except for manufacturer warranty claims.
            </p>
          </div>

          {/* Section 1 */}
          <section className={styles.section} id="inspect-at-delivery">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>01.</span>
              <h2 className={styles.sectionTitle}>Inspect at Delivery</h2>
            </div>
            <div className={styles.text}>
              <p>
                Every order must be inspected in front of the delivery agent, before you accept it. This is your opportunity to confirm the item is correct and undamaged.
              </p>
              <p>
                If, on inspection, the item is:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>Physically damaged,</li>
                <li className={styles.listItem}>Defective / not working, or</li>
                <li className={styles.listItem}>Different from what you ordered (wrong product, color, or variant),</li>
              </ul>
              <p>
                you can refuse and hand it back to the delivery agent on the spot. The delivery charge (or the full amount, if you paid in advance) is not refunded — instead, we'll send you the correct product, with no additional delivery charge.
              </p>
              <div className={styles.alertBox}>
                <div className={styles.alertBoxTitle}>
                  <ShieldAlert size={16} /> Important Notice
                </div>
                Once you've accepted the delivery, this inspection window closes and the item cannot be returned — except under a manufacturer warranty claim (see §3).
              </div>
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
                <li className={styles.listItem}>
                  <strong>Change of mind:</strong> We don't accept returns simply because you no longer want the item — please make sure you want it before you accept delivery.
                </li>
                <li className={styles.listItem}>
                  Damage or issues that occur after you've accepted the item (e.g., from drops, misuse, water damage, unauthorized repairs), unless covered by warranty terms.
                </li>
                <li className={styles.listItem}>
                  Returns without a valid order number or proof of purchase.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section} id="warranty-returns">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>03.</span>
              <h2 className={styles.sectionTitle}>Warranty-Period Returns</h2>
            </div>
            <div className={styles.text}>
              <p>
                If a product develops a genuine fault after you've accepted delivery, but within its manufacturer warranty period, it's still eligible for a warranty claim:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>Warranty length and coverage vary by product and are listed on each product page.</li>
                <li className={styles.listItem}>Contact us with your order number to start a claim (see §6).</li>
                <li className={styles.listItem}>Return shipping for warranty claims is the customer's responsibility.</li>
                <li className={styles.listItem}>Warranty claims are typically resolved through repair or replacement, not a cash refund, unless neither is possible.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section} id="exchanges">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>04.</span>
              <h2 className={styles.sectionTitle}>Exchanges</h2>
            </div>
            <div className={styles.text}>
              <p>
                If the item you receive is the wrong color, wrong variant, or damaged, this follows the same process as §1: hand it back to the delivery agent, and we'll send the correct item — subject to stock availability — with no additional delivery charge.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section} id="refunds">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>05.</span>
              <h2 className={styles.sectionTitle}>Refunds</h2>
            </div>
            <div className={styles.text}>
              <p>
                At-delivery returns are resolved by sending a replacement, not a refund (§1). Refunds apply only to warranty claims where repair or replacement isn't possible (§3):
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>BanglaQR</strong> payments are refunded to your original payment method.
                </li>
                <li className={styles.listItem}>
                  <strong>Cash on Delivery</strong> payments are refunded as store credit or bank transfer.
                </li>
                <li className={styles.listItem}>
                  Refunds are processed within 7 business days.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section} id="how-to-start">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>06.</span>
              <h2 className={styles.sectionTitle}>How to Start a Return or Claim</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>At delivery:</strong> Tell the delivery agent directly — no need to contact us separately first.
                </li>
                <li className={styles.listItem}>
                  <strong>Warranty claims:</strong> Reach us at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> (phone or WhatsApp) or <a href="mailto:support@innoversely.com" className={styles.link}>support@innoversely.com</a> with your order number and a description of the issue.
                </li>
              </ul>
            </div>
          </section>

          {/* Quick Links */}
          <div className={styles.navRow}>
            <Link href="/faq" className={styles.navLink}>
              <HelpCircle size={16} /> Read FAQ <ArrowRight size={14} />
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
