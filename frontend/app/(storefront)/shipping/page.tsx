import Link from "next/link";
import { ShieldAlert, ArrowRight, HelpCircle, PhoneCall, FileText } from "lucide-react";
import styles from "./Shipping.module.css";

export const metadata = {
  title: "Shipping Info | Innoverse Technologies",
  description: "Read the delivery policy and shipping information of Innoverse Technologies. Nationwide delivery via Pathao.",
};

export default function ShippingInfoPage() {
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
          <span className="breadcrumb__current">Shipping Info</span>
        </li>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Shipping & Delivery Info</h1>
        <p className={styles.subtitle}>
          Learn about our shipping coverage, delivery timelines, charges, and packaging standards at Innoverse Technologies.
        </p>
      </header>

      {/* Main Layout */}
      <div className={styles.layout}>
        <main className={styles.contentBlock}>
          {/* Summary Box */}
          <div className={styles.summaryBox}>
            <p>
              <strong>In short:</strong> We deliver nationwide through Pathao, split into Inside Dhaka (2–3 business days) and Outside Dhaka (3–5 business days). Delivery charges are shown at checkout before you pay, and — important — you'll need to inspect your item with the delivery agent before accepting it (see our Return Policy).
            </p>
          </div>

          {/* Section 1 */}
          <section className={styles.section} id="where-we-deliver">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>01.</span>
              <h2 className={styles.sectionTitle}>Where We Deliver</h2>
            </div>
            <div className={styles.text}>
              <p>
                We deliver nationwide across Bangladesh through our courier partner, Pathao. Delivery is split into two zones:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>Inside Dhaka</li>
                <li className={styles.listItem}>Outside Dhaka</li>
              </ul>
              <p>
                Your zone is determined automatically from the delivery address you enter at checkout, and it affects both delivery cost and timeline.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className={styles.section} id="delivery-timelines">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>02.</span>
              <h2 className={styles.sectionTitle}>Delivery Timelines</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}><strong>Inside Dhaka:</strong> 2–3 business days</li>
                <li className={styles.listItem}><strong>Outside Dhaka:</strong> 3–5 business days</li>
              </ul>
              <p>
                These are typical timelines from order confirmation to delivery. Exact timing for your address is shown at checkout before you pay, and you'll get SMS/email updates as your order moves — confirmed, shipped, out for delivery, delivered.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section} id="delivery-charges">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>03.</span>
              <h2 className={styles.sectionTitle}>Delivery Charges</h2>
            </div>
            <div className={styles.text}>
              <p>
                Delivery charges depend on your zone (Inside/Outside Dhaka) and are shown clearly at checkout, before you confirm your order — never as a surprise afterward.
              </p>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tableTh}>Zone</th>
                      <th className={styles.tableTh}>Delivery Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={styles.tableRow}>
                      <td className={styles.tableTd}>Inside Dhaka</td>
                      <td className={styles.tableTd}>৳ 80</td>
                    </tr>
                    <tr className={styles.tableRow}>
                      <td className={styles.tableTd}>Outside Dhaka</td>
                      <td className={styles.tableTd}>৳ 130</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>There is no minimum order value required to check out.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section} id="processing-time">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>04.</span>
              <h2 className={styles.sectionTitle}>Order Processing Time</h2>
            </div>
            <div className={styles.text}>
              <p>
                Orders are handed off to Pathao for delivery within 1 business day of confirmation (same-day if placed before 12:00 PM). This processing time is separate from — and in addition to — the delivery timelines in §2.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section} id="tracking-order">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>05.</span>
              <h2 className={styles.sectionTitle}>Tracking Your Order</h2>
            </div>
            <div className={styles.text}>
              <p>
                Every order gets a tracking number as soon as it's placed, sent by SMS/email and shown on your order confirmation. You can:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  Enter it on our <Link href="/track" className={styles.link}>Track Order</Link> page — no account needed, or
                </li>
                <li className={styles.listItem}>
                  View live status from your account if you're logged in, with a full timeline: Placed → Confirmed → Processing → Shipped → Out for Delivery → Delivered.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section} id="payment-on-delivery">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>06.</span>
              <h2 className={styles.sectionTitle}>Payment on Delivery</h2>
            </div>
            <div className={styles.text}>
              <p>
                If you chose Cash on Delivery, the delivery charge is paid upfront via BanglaQR at checkout — this applies to every COD order, no exceptions — and the remaining item cost is paid in cash when your order arrives. Full details are in our <Link href="/payment-policy" className={styles.link}>Payment Policy</Link>.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className={styles.section} id="inspect-before-accept">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>07.</span>
              <h2 className={styles.sectionTitle}>Inspect Before You Accept</h2>
            </div>
            <div className={styles.text}>
              <p>
                This is the most important part of receiving your order: check the item in front of the Pathao delivery agent before you accept it. If it's damaged, defective, or not what you ordered, hand it back on the spot and we'll send the correct item — no additional delivery charge.
              </p>
              <div className={styles.alertBox}>
                <div className={styles.alertBoxTitle}>
                  <ShieldAlert size={16} /> Critical Action Required
                </div>
                Once you've accepted delivery, this inspection window closes. Full details are in our <Link href="/return-policy" className={styles.link}>Return Policy</Link>.
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className={styles.section} id="failed-delivery">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>08.</span>
              <h2 className={styles.sectionTitle}>Missed or Failed Delivery</h2>
            </div>
            <div className={styles.text}>
              <p>If you're not available when Pathao attempts delivery:</p>
              <ul className={styles.list}>
                <li className={styles.listItem}>We'll attempt redelivery up to 3 times on the following business days.</li>
                <li className={styles.listItem}>If all attempts fail, the order will be returned to our fulfillment facility. If you paid in advance, we will contact you to issue a refund or store credit.</li>
              </ul>
              <p>
                To avoid a missed delivery, make sure your address and phone number are accurate at checkout, and keep an eye on SMS updates for the expected delivery window.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className={styles.section} id="restrictions">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>09.</span>
              <h2 className={styles.sectionTitle}>Delivery Restrictions</h2>
            </div>
            <div className={styles.text}>
              <p>
                We currently deliver to all areas Pathao covers nationwide. If your area has specific courier coverage limitations, delivery may take slightly longer than the standard timelines mentioned in §2.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className={styles.section} id="delays">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>10.</span>
              <h2 className={styles.sectionTitle}>Peak Season Delays</h2>
            </div>
            <div className={styles.text}>
              <p>
                During high-volume periods (Eid and other major holidays, large promotional sales), delivery may take longer than the timelines in §2. We'll flag this on the site and at checkout when it applies.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className={styles.section} id="packaging">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>11.</span>
              <h2 className={styles.sectionTitle}>Packaging</h2>
            </div>
            <div className={styles.text}>
              <p>
                Electronics are packed with protective materials appropriate to the item to minimize the risk of transit damage. If a package does arrive damaged, that's exactly what the inspect-before-you-accept process in §7 is there to catch.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section className={styles.section} id="questions">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>12.</span>
              <h2 className={styles.sectionTitle}>Questions About Your Delivery</h2>
            </div>
            <div className={styles.text}>
              <p>
                Contact us at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> (phone or WhatsApp) or <a href="mailto:support@innoversely.com" className={styles.link}>support@innoversely.com</a> with your order number.
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
