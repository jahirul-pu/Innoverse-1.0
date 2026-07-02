import Link from "next/link";
import { ShieldCheck, ArrowRight, HelpCircle, PhoneCall, FileText } from "lucide-react";
import styles from "./PaymentPolicy.module.css";

export const metadata = {
  title: "Payment Policy | Innoverse Technologies",
  description: "Read the payment guidelines and policy of Innoverse Technologies. Learn about Cash on Delivery (COD) and BanglaQR.",
};

export default function PaymentPolicyPage() {
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
          <span className="breadcrumb__current">Payment Policy</span>
        </li>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Payment Policy</h1>
        <p className={styles.subtitle}>
          Read through our payment guidelines, supported methods, pricing rules, refunds, and transactional security parameters at Innoverse Technologies.
        </p>
      </header>

      {/* Main Layout */}
      <div className={styles.layout}>
        <main className={styles.contentBlock}>
          {/* Summary Box */}
          <div className={styles.summaryBox}>
            <p>
              <strong>In short:</strong> We accept Cash on Delivery and BanglaQR. For Cash on Delivery, the delivery charge is paid upfront via BanglaQR — no exceptions — with the rest paid in cash on arrival. All prices are shown in Bangladeshi Taka (৳) and already include VAT.
            </p>
          </div>

          {/* Section 1 */}
          <section className={styles.section} id="payment-methods">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>01.</span>
              <h2 className={styles.sectionTitle}>Payment Methods</h2>
            </div>
            <div className={styles.text}>
              <p>We offer two payment methods, available on every order:</p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>Cash on Delivery (COD)</strong> — the delivery charge is paid in advance via BanglaQR at checkout; the remaining item cost is paid in cash when your order arrives. This advance payment applies to every COD order, with no exceptions.
                </li>
                <li className={styles.listItem}>
                  <strong>BanglaQR (full payment)</strong> — pay the entire order amount upfront. BanglaQR is Bangladesh Bank's interoperable QR payment standard: scan the code at checkout with whichever banking or mobile financial services app you already use (bKash, Nagad, Rocket, or a participating bank app) and pay directly from your own account.
                </li>
              </ul>
              <p>We do not currently accept card payments or other mobile financial services outside of BanglaQR.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className={styles.section} id="how-banglaqr-works">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>02.</span>
              <h2 className={styles.sectionTitle}>How BanglaQR Works</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>At checkout, select Cash on Delivery or BanglaQR.</li>
                <li className={styles.listItem}>A QR code is generated for the amount due (the delivery charge for COD, or the full order total for BanglaQR).</li>
                <li className={styles.listItem}>Scan it using your preferred banking or MFS app and confirm the payment there.</li>
                <li className={styles.listItem}>Your order is confirmed once the payment is verified — you'll see this on the confirmation screen and receive an SMS/email.</li>
              </ul>
              <p>BanglaQR payments go directly from your own bank/MFS account to ours. We never see or store your banking credentials.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section} id="pricing-vat">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>03.</span>
              <h2 className={styles.sectionTitle}>Pricing & VAT</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>All prices shown on the site are in Bangladeshi Taka (৳).</li>
                <li className={styles.listItem}>Prices are VAT-inclusive — the price you see is the price you pay, with no VAT added as a separate line at checkout.</li>
                <li className={styles.listItem}>Delivery charges are shown separately at checkout, based on your delivery zone (Inside/Outside Dhaka), before you pay.</li>
                <li className={styles.listItem}>There is no minimum order value.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section} id="failed-payments">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>04.</span>
              <h2 className={styles.sectionTitle}>Failed or Incomplete Payments</h2>
            </div>
            <div className={styles.text}>
              <p>If a BanglaQR payment isn't completed — the code isn't scanned, the payment fails, or it's abandoned partway — your order isn't placed. You can simply try again at checkout. No charge is made unless the payment is successfully confirmed.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section} id="order-cancellations">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>05.</span>
              <h2 className={styles.sectionTitle}>Order Cancellations</h2>
            </div>
            <div className={styles.text}>
              <p>If you cancel an order before it ships, any advance payment made via BanglaQR (the delivery charge on a COD order, or the full amount on a BanglaQR order) is refunded in full. See our FAQ for how to request a cancellation.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section} id="refunds">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>06.</span>
              <h2 className={styles.sectionTitle}>Refunds</h2>
            </div>
            <div className={styles.text}>
              <p>Refunds are issued in the following cases:</p>
              <ul className={styles.list}>
                <li className={styles.listItem}>Order cancelled before shipment (§5) — full refund of any advance payment.</li>
                <li className={styles.listItem}>Warranty claims where repair or replacement isn't possible — see our <Link href="/warranty" className={styles.link}>Warranty Policy</Link>.</li>
              </ul>
              <p>
                Refunds are not issued for at-delivery returns — those are resolved by sending a replacement item instead, at no additional delivery charge (see our <Link href="/return-policy" className={styles.link}>Return Policy §1</Link>).
              </p>
              <p>Where a refund applies:</p>
              <ul className={styles.list}>
                <li className={styles.listItem}><strong>BanglaQR</strong> payments are refunded to your original payment method.</li>
                <li className={styles.listItem}><strong>Cash on Delivery</strong> advance payments are refunded as store credit or bank transfer.</li>
                <li className={styles.listItem}>Refunds are processed within 7 business days.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className={styles.section} id="payment-security">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>07.</span>
              <h2 className={styles.sectionTitle}>Payment Security</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>BanglaQR is issued and regulated by Bangladesh Bank; payments are processed through your own bank or MFS provider, not stored or handled by us directly.</li>
                <li className={styles.listItem}>Checkout is secured over HTTPS.</li>
              </ul>
              <div className={styles.alertBox}>
                <div className={styles.alertBoxTitle}>
                  <ShieldCheck size={16} /> Security Warning
                </div>
                We never ask for your banking PIN, password, or OTP over phone, SMS, or WhatsApp — if anyone claiming to be from Innoverse Technologies asks for these, please don't share them and contact us immediately at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a>.
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className={styles.section} id="payment-questions">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>08.</span>
              <h2 className={styles.sectionTitle}>Questions About a Payment</h2>
            </div>
            <div className={styles.text}>
              <p>
                Contact us at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> (phone or WhatsApp) or <a href="mailto:support@innoversely.com" className={styles.link}>support@innoversely.com</a> with your order number, and we'll look into it.
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
            Last updated: {currentDate}. This policy may be updated from time to time; the version shown on our website at the time of your order applies to that order.
          </p>
        </main>
      </div>
    </div>
  );
}
