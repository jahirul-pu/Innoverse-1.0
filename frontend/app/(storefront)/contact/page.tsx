"use client";

import { useState } from "react";
import { useToast } from "@/components/providers/ToastContext";
import Link from "next/link";
import { Phone, MessageSquare, Mail, Clock, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import styles from "./Contact.module.css";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    contactInfo: "",
    orderNumber: "",
    subject: "Order status / tracking",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactInfo || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.contactContainer}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">Home</Link>
        </li>
        <li className="breadcrumb__item">
          <span className="breadcrumb__current">Contact Us</span>
        </li>
      </nav>

      {/* Header */}
      <header className={styles.contactHeader}>
        <h1 className={styles.contactTitle}>Contact Us</h1>
        <p className={styles.contactSubtitle}>
          Got a question about an order, a product, or anything else? We're online-only, so this page — not a storefront — is how you reach us. We're happy to help.
        </p>
      </header>

      {/* Grid Content */}
      <div className={styles.contactGrid}>
        {/* Left Column: Get in Touch & Info */}
        <div className={styles.contactSidebar}>
          {/* Card: Info */}
          <section className={styles.cardSection} aria-labelledby="get-in-touch-title">
            <h2 id="get-in-touch-title" className={styles.cardTitle}>Get in Touch</h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <Phone className={styles.infoIcon} size={20} />
                <div>
                  <div className={styles.infoLabel}>Phone</div>
                  <div className={styles.infoValue}>
                    <a href="tel:+8801903022077">+880 1903022077</a>
                  </div>
                </div>
              </div>

              <div className={styles.infoItem}>
                <MessageSquare className={styles.infoIcon} size={20} />
                <div>
                  <div className={styles.infoLabel}>WhatsApp</div>
                  <div className={styles.infoValue}>
                    <a href="https://wa.me/8801903022077" target="_blank" rel="noopener noreferrer">+880 1903022077</a>
                  </div>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Mail className={styles.infoIcon} size={20} />
                <div>
                  <div className={styles.infoLabel}>Email</div>
                  <div className={styles.infoValue}>
                    <a href="mailto:support@innoversely.com">support@innoversely.com</a>
                  </div>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Clock className={styles.infoIcon} size={20} />
                <div>
                  <div className={styles.infoLabel}>Support Hours</div>
                  <div className={styles.infoValue}>10:00 AM – 8:00 PM, Saturday – Thursday</div>
                </div>
              </div>
            </div>

            <div className={styles.infoNote}>
              <strong>Note:</strong> For the fastest response on an existing order, have your order number ready — you'll find it in your confirmation SMS/email or under Order History if you're logged in.
            </div>
          </section>

          {/* Card: Quick Links */}
          <section className={styles.cardSection} aria-labelledby="quick-links-title">
            <h2 id="quick-links-title" className={styles.cardTitle}>Quick Links</h2>
            <div className={styles.quickLinksList}>
              <Link href="/track" className={styles.quickLinkCard}>
                <div className={styles.quickLinkTitle}>Track Your Order</div>
                <div className={styles.quickLinkDesc}>Check delivery status with your tracking number, no account needed</div>
              </Link>
              <Link href="/faq" className={styles.quickLinkCard}>
                <div className={styles.quickLinkTitle}>FAQ</div>
                <div className={styles.quickLinkDesc}>Answers to the most common questions on ordering, payment, delivery, and returns</div>
              </Link>
              <Link href="/return-policy" className={styles.quickLinkCard}>
                <div className={styles.quickLinkTitle}>Return Policy</div>
                <div className={styles.quickLinkDesc}>Full details on our inspect-at-delivery return process and warranty claims</div>
              </Link>
              <Link href="/payment-policy" className={styles.quickLinkCard}>
                <div className={styles.quickLinkTitle}>Payment Policy</div>
                <div className={styles.quickLinkDesc}>How Cash on Delivery and BanglaQR work at checkout</div>
              </Link>
            </div>
          </section>

          {/* Card: Response Time */}
          <section className={styles.cardSection} aria-labelledby="response-time-title">
            <h2 id="response-time-title" className={styles.cardTitle}>Response Time</h2>
            <div className={styles.infoValue} style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)" }}>
              We aim to respond to email and form messages within 24 hours (1 business day). For anything urgent — like catching an issue with an order that's about to be delivered — phone or WhatsApp is faster than email or the form.
            </div>
          </section>
        </div>

        {/* Right Column: Message Form, Address, Socials */}
        <div className={styles.contactSidebar}>
          {/* Card: Form */}
          <section className={styles.formWrapper} aria-labelledby="send-message-title">
            <h2 id="send-message-title" className={styles.cardTitle}>Send Us a Message</h2>
            <p className={styles.infoValue} style={{ marginBottom: "var(--space-6)", fontSize: "var(--text-sm)" }}>
              Prefer not to call? Use the form below and we'll get back to you.
            </p>

            {submitSuccess ? (
              <div className={styles.successMessage}>
                <CheckCircle className={styles.infoIcon} size={48} style={{ color: "var(--color-circuit-green)", margin: "0 auto var(--space-4) auto" }} />
                <h3 className={styles.successTitle}>Message Sent!</h3>
                <p className={styles.successText}>
                  Thank you for reaching out. A copy of your inquiry has been routed straight to our support team inbox. We'll get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData({
                      name: "",
                      contactInfo: "",
                      orderNumber: "",
                      subject: "Order status / tracking",
                      message: "",
                    });
                  }}
                  className="btn btn--secondary btn--sm"
                  style={{ marginTop: "var(--space-4)" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.inputField}
                    placeholder="Your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contactInfo" className={styles.formLabel}>Email or Phone Number *</label>
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    required
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className={styles.inputField}
                    placeholder="So we can reply to you"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="orderNumber" className={styles.formLabel}>Order Number (optional)</label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    className={styles.inputField}
                    placeholder="Include if this is about an existing order"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.formLabel}>What's this about? *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="Order status / tracking">Order status / tracking</option>
                    <option value="Return, exchange, or warranty claim">Return, exchange, or warranty claim</option>
                    <option value="Payment issue">Payment issue</option>
                    <option value="Product question">Product question</option>
                    <option value="Partnership / business inquiry">Partnership / business inquiry</option>
                    <option value="Something else">Something else</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textareaField}
                    placeholder="Type your message details here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.formSubmitBtn}
                  id="contact-form-submit-btn"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                  {!isSubmitting && <ArrowRight size={18} style={{ marginLeft: "var(--space-2)" }} />}
                </button>

                <p className={styles.formNote}>
                  Form submissions are routed straight to our support inbox, so there's no need to also call or email separately.
                </p>
              </form>
            )}
          </section>

          {/* Card: Business Address */}
          <section className={styles.cardSection} aria-labelledby="business-address-title">
            <h2 id="business-address-title" className={styles.cardTitle}>Business Address</h2>
            <div className={styles.infoItem}>
              <MapPin className={styles.infoIcon} size={20} />
              <div className={styles.infoValue} style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)" }}>
                <p style={{ marginBottom: "var(--space-2)" }}>
                  Innoverse Technologies operates entirely online and doesn't have a physical storefront for walk-in visits or in-person returns — all orders are delivered through Pathao, and all returns happen at the point of delivery.
                </p>
                <p style={{ fontFamily: "var(--font-data)", color: "var(--color-text-primary)" }}>
                  <strong>Innoverse Technologies Ltd.</strong><br />
                  Dhaka, Bangladesh (Correspondence only)
                </p>
              </div>
            </div>
          </section>

          {/* Card: Follow Us */}
          <section className={styles.cardSection} aria-labelledby="follow-us-title">
            <h2 id="follow-us-title" className={styles.cardTitle}>Follow Us</h2>
            <div className={styles.socialsRow}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ flexShrink: 0 }}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg> Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ flexShrink: 0 }}>
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg> Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ flexShrink: 0 }}>
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff" />
                </svg> YouTube
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
