import Link from "next/link";
import { HelpCircle, PhoneCall, FileText, ArrowRight } from "lucide-react";
import styles from "./Terms.module.css";

export const metadata = {
  title: "Terms and Conditions | Innoverse Technologies",
  description: "Read the Terms and Conditions of Innoverse Technologies. Understand user agreements, pricing rules, payment policies, and dispute resolutions.",
};

export default function TermsAndConditionsPage() {
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
          <span className="breadcrumb__current">Terms & Conditions</span>
        </li>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Terms and Conditions</h1>
        <p className={styles.subtitle}>
          Please read these terms carefully before placing an order or using our services.
        </p>
      </header>

      {/* Main Layout */}
      <div className={styles.layout}>
        <main className={styles.contentBlock}>
          {/* Summary Box */}
          <div className={styles.summaryBox}>
            <p>
              <strong>In short:</strong> By ordering from Innoverse Technologies, you agree to these terms — how orders and payment work, what we can and can't guarantee, and how disputes are handled. Our Payment Policy, Shipping Info, Return Policy, and Warranty Policy are part of these terms by reference.
            </p>
          </div>

          {/* Section 1 */}
          <section className={styles.section} id="acceptance">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>01.</span>
              <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
            </div>
            <div className={styles.text}>
              <p>
                By accessing or placing an order on the Innoverse Technologies website, you agree to be bound by these Terms and Conditions, along with our <Link href="/payment-policy" className={styles.link}>Payment Policy</Link>, <Link href="/shipping" className={styles.link}>Shipping Info</Link>, <Link href="/return-policy" className={styles.link}>Return Policy</Link>, <Link href="/warranty" className={styles.link}>Warranty Policy</Link>, Privacy Policy, and Cookie Policy. If you don't agree with any part of these terms, please don't use the site.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className={styles.section} id="accounts">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>02.</span>
              <h2 className={styles.sectionTitle}>Accounts</h2>
            </div>
            <div className={styles.text}>
              <p>
                You can check out as a guest without creating an account. If you do create one, you're responsible for keeping your login details secure and for all activity under your account. Let us know immediately at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> if you suspect unauthorized use.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section} id="products-pricing">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>03.</span>
              <h2 className={styles.sectionTitle}>Products & Pricing</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  We make reasonable efforts to ensure product descriptions, images, and prices are accurate, but errors can happen. If we discover a pricing or listing error after you've ordered, we'll contact you before proceeding — you can accept the corrected price or cancel for a full refund of anything already paid.
                </li>
                <li className={styles.listItem}>
                  All prices are shown in Bangladeshi Taka (৳) and are VAT-inclusive.
                </li>
                <li className={styles.listItem}>
                  Product availability can change at any time. Placing an order doesn't guarantee stock — if an item becomes unavailable after you order, we'll contact you to arrange a substitute, delay, or full refund of anything already paid.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section} id="orders">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>04.</span>
              <h2 className={styles.sectionTitle}>Orders</h2>
            </div>
            <div className={styles.text}>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  Placing an order is an offer to purchase, not a binding contract until we confirm it.
                </li>
                <li className={styles.listItem}>
                  We reserve the right to refuse, cancel, or limit any order — for example, in cases of suspected fraud, repeated failed Cash on Delivery deliveries, pricing/listing errors, or unavailable stock.
                </li>
                <li className={styles.listItem}>
                  You can cancel or modify an order before it ships by contacting us at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a>. See our FAQ for details.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section} id="payment">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>05.</span>
              <h2 className={styles.sectionTitle}>Payment</h2>
            </div>
            <div className={styles.text}>
              <p>
                Payment is by Cash on Delivery or BanglaQR only, as described in full in our <Link href="/payment-policy" className={styles.link}>Payment Policy</Link>. In summary: Cash on Delivery requires the delivery charge to be paid upfront via BanglaQR, with no exceptions; BanglaQR can also be used to pay the full order amount upfront.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section} id="shipping">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>06.</span>
              <h2 className={styles.sectionTitle}>Shipping & Delivery</h2>
            </div>
            <div className={styles.text}>
              <p>
                We deliver nationwide through our courier partner, Pathao, as described in our <Link href="/shipping" className={styles.link}>Shipping Info</Link> page. Delivery timelines are estimates, not guarantees, and may be affected by your location, weather, courier capacity, or events outside our control (see §11, Force Majeure).
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className={styles.section} id="returns">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>07.</span>
              <h2 className={styles.sectionTitle}>Returns, Exchanges & Warranty</h2>
            </div>
            <div className={styles.text}>
              <p>
                All orders must be inspected in front of the delivery agent before being accepted — this is your opportunity to catch a damaged, defective, or incorrect item. Once delivery is accepted, returns are not accepted except under a manufacturer warranty claim. Full terms are in our <Link href="/return-policy" className={styles.link}>Return Policy</Link> and <Link href="/warranty" className={styles.link}>Warranty Policy</Link>, which form part of these Terms.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className={styles.section} id="intellectual-property">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>08.</span>
              <h2 className={styles.sectionTitle}>Intellectual Property</h2>
            </div>
            <div className={styles.text}>
              <p>
                All content on this website — including text, images, logos, graphics, and design — is owned by or licensed to Innoverse Technologies, unless otherwise credited (e.g., manufacturer product photos). You may not copy, reproduce, or use this content commercially without our written permission.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className={styles.section} id="acceptable-use">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>09.</span>
              <h2 className={styles.sectionTitle}>Acceptable Use</h2>
            </div>
            <div className={styles.text}>
              <p>You agree not to:</p>
              <ul className={styles.list}>
                <li className={styles.listItem}>Place fraudulent orders, or orders you don't intend to pay for or accept.</li>
                <li className={styles.listItem}>Attempt to interfere with, hack, or disrupt the website or its systems.</li>
                <li className={styles.listItem}>Use the website for any unlawful purpose.</li>
              </ul>
              <p>
                We reserve the right to suspend or refuse service to anyone found in violation of these terms.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className={styles.section} id="liability">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>10.</span>
              <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
            </div>
            <div className={styles.text}>
              <p>
                We work to keep product listings, pricing, and delivery estimates accurate, but Innoverse Technologies is not liable for indirect, incidental, or consequential damages arising from your use of the website or the products purchased through it, to the fullest extent permitted by Bangladeshi law. This doesn't limit any rights you have that can't be excluded under applicable consumer-protection law.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className={styles.section} id="force-majeure">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>11.</span>
              <h2 className={styles.sectionTitle}>Force Majeure</h2>
            </div>
            <div className={styles.text}>
              <p>
                We're not responsible for delays or failures in delivery or service caused by events outside our reasonable control — including natural disasters, strikes, government actions, courier disruptions, or internet/network outages.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section className={styles.section} id="third-party">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>12.</span>
              <h2 className={styles.sectionTitle}>Third-Party Services</h2>
            </div>
            <div className={styles.text}>
              <p>
                Orders are delivered by Pathao, and digital payments are processed via BanglaQR through your own bank or MFS provider. While we choose these partners carefully, we're not responsible for issues arising directly from their systems or services, and we'll work with you to resolve any issues these may cause with your order.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section className={styles.section} id="privacy">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>13.</span>
              <h2 className={styles.sectionTitle}>Privacy</h2>
            </div>
            <div className={styles.text}>
              <p>
                Your personal information is handled in accordance with our Privacy Policy and Cookie Policy.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section className={styles.section} id="changes">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>14.</span>
              <h2 className={styles.sectionTitle}>Changes to These Terms</h2>
            </div>
            <div className={styles.text}>
              <p>
                We may update these Terms and Conditions from time to time. The version published on the site at the time of your order applies to that order. Significant changes will be reflected in the "Last updated" date below.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section className={styles.section} id="governing-law">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>15.</span>
              <h2 className={styles.sectionTitle}>Governing Law & Disputes</h2>
            </div>
            <div className={styles.text}>
              <p>
                These Terms are governed by the laws of Bangladesh. Any disputes arising from these Terms or your use of the website will be subject to the exclusive jurisdiction of the courts of Dhaka. We encourage you to reach out to our customer support to resolve any issues informally before initiating formal proceedings.
              </p>
            </div>
          </section>

          {/* Section 16 */}
          <section className={styles.section} id="severability">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>16.</span>
              <h2 className={styles.sectionTitle}>Severability</h2>
            </div>
            <div className={styles.text}>
              <p>
                If any part of these Terms is found unenforceable, the remaining terms continue to apply in full.
              </p>
            </div>
          </section>

          {/* Section 17 */}
          <section className={styles.section} id="contact">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>17.</span>
              <h2 className={styles.sectionTitle}>Contact Us</h2>
            </div>
            <div className={styles.text}>
              <p>
                Questions about these Terms? Reach us at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> (phone or WhatsApp) or <a href="mailto:support@innoversely.com" className={styles.link}>support@innoversely.com</a>. See also our <Link href="/contact" className={styles.link}>Contact Us</Link> page.
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
