"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Phone, MessageSquare, Mail, HelpCircle } from "lucide-react";
import styles from "./Faq.module.css";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  const faqData: FAQCategory[] = [
    {
      id: "ordering",
      title: "Ordering",
      items: [
        {
          question: "Do I need to create an account to place an order?",
          answer: (
            <p>
              No. You can check out as a guest with just your name, address, and phone number. We'll ask if you'd like to save your details to an account so you can track this order and see it in your order history later — it's optional, but it makes reordering and tracking faster next time.
            </p>
          ),
        },
        {
          question: "Is there a minimum order value?",
          answer: <p>No. You can order a single item, no matter the price.</p>,
        },
        {
          question: "Can I change or cancel my order after placing it?",
          answer: (
            <p>
              Yes, as long as it hasn't been shipped yet. Contact us as soon as possible at{" "}
              <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> with your order number, and we'll update or cancel it if it's still in progress.
            </p>
          ),
        },
        {
          question: "How do I track my order?",
          answer: (
            <p>
              Every order gets a tracking number as soon as it's placed — you'll see it on the confirmation screen and receive it by SMS/email. Enter it on our{" "}
              <Link href="/track" className={styles.link}>Track Order</Link> page, or check your order status anytime from your account if you're logged in.
            </p>
          ),
        },
        {
          question: "I placed an order but didn't get a confirmation. What happened?",
          answer: (
            <p>
              Check your spam folder for the email, and double-check the phone number you entered for SMS. If you still can't find it, contact us at{" "}
              <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> with your name and approximate order time and we'll look it up.
            </p>
          ),
        },
      ],
    },
    {
      id: "payment",
      title: "Payment",
      items: [
        {
          question: "What payment methods do you accept?",
          answer: (
            <div>
              <p>Two options, both available on every order:</p>
              <ul>
                <li>
                  <strong>Cash on Delivery (COD)</strong> — the delivery charge is paid upfront via BanglaQR at checkout, and the remaining item cost is paid in cash when your order arrives.
                </li>
                <li>
                  <strong>BanglaQR</strong> — pay the full order amount upfront. Bangladesh Bank's interoperable QR payment standard: at checkout, scan the QR code with your usual banking or mobile financial services app (bKash, Nagad, Rocket, or your bank's app) and pay directly from your own account — no need for a separate wallet or card.
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "Are your prices inclusive of VAT?",
          answer: <p>Yes. The price you see is the price you pay — VAT is already included, so there are no surprise charges added at checkout.</p>,
        },
        {
          question: "Is Cash on Delivery available everywhere?",
          answer: <p>Yes, COD is available across our full delivery coverage, both inside and outside Dhaka.</p>,
        },
        {
          question: "Will I ever be asked to pay in advance?",
          answer: (
            <p>
              Yes, if you choose Cash on Delivery: the delivery charge is paid in advance via BanglaQR at checkout, and the remaining item cost is paid in cash when your order arrives. This applies to every COD order, no exceptions. If you'd rather not pay anything at the door, you can also choose to pay the full order amount upfront via BanglaQR at checkout.
            </p>
          ),
        },
        {
          question: "Is BanglaQR safe to use?",
          answer: (
            <p>
              Yes — it's a payment standard issued and regulated by Bangladesh Bank, and payments go directly from your own bank/MFS account through your own app. We never see or store your banking details.
            </p>
          ),
        },
      ],
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      items: [
        {
          question: "Where do you deliver?",
          answer: (
            <p>
              Nationwide, across Bangladesh, through our delivery partner Pathao. Delivery is split into two zones — Inside Dhaka and Outside Dhaka — with different costs and timelines shown at checkout before you pay.
            </p>
          ),
        },
        {
          question: "How long does delivery take?",
          answer: (
            <div>
              <p>Delivery standard timelines:</p>
              <ul>
                <li><strong>Inside Dhaka:</strong> 2–3 business days</li>
                <li><strong>Outside Dhaka:</strong> 3–5 business days</li>
              </ul>
              <p>Exact timing is shown for your specific address at checkout, and you'll get SMS/email updates as your order moves — confirmed, shipped, out for delivery, delivered.</p>
            </div>
          ),
        },
        {
          question: "How much does delivery cost?",
          answer: (
            <p>
              Delivery charges depend on your zone (Inside/Outside Dhaka) and are shown clearly at checkout before you confirm your order — never as a surprise afterward.
            </p>
          ),
        },
        {
          question: "Can I change my delivery address after ordering?",
          answer: (
            <p>
              If your order hasn't shipped yet, contact us at{" "}
              <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> with your order number and we'll update it. Once it's with Pathao for delivery, changes may not be possible.
            </p>
          ),
        },
        {
          question: "Who delivers my order?",
          answer: (
            <p>
              Pathao, our nationwide courier partner. You'll get a Pathao tracking number once your order ships.
            </p>
          ),
        },
      ],
    },
    {
      id: "returns",
      title: "Returns, Exchanges & Warranty",
      items: [
        {
          question: "What is your return policy?",
          answer: (
            <p>
              Please inspect your item in front of the delivery agent before accepting it. If it's physically damaged, defective, or different from what you ordered, you can return it immediately, right there at the door. We don't accept returns after delivery has been accepted. Separately, if a product develops a fault during its manufacturer warranty period, it can still be returned or claimed under warranty — in that case, the customer covers the return shipping cost. See our full Return Policy page for details.
            </p>
          ),
        },
        {
          question: "My order arrived damaged or not working. What do I do?",
          answer: (
            <p>
              Check the item in front of the delivery agent before accepting it — if it's physically damaged, defective, or not what you ordered, return it right then with the delivery agent; there's no charge to you. If a fault develops later and the product is still within its manufacturer warranty period, contact us at{" "}
              <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> with your order number and we'll guide you through the warranty claim — note that return shipping in this case is the customer's responsibility.
            </p>
          ),
        },
        {
          question: "Do your products come with a warranty?",
          answer: (
            <p>
              Warranty coverage varies by product and is listed on each product page. If a covered product develops a fault during its warranty period, we'll help you through the claim process — contact us at{" "}
              <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> with your order number. Return shipping for warranty claims is the customer's responsibility.
            </p>
          ),
        },
        {
          question: "How do refunds work?",
          answer: (
            <p>
              For items returned at the point of delivery, refunds are processed back to your original payment method where possible (BanglaQR orders), or as store credit / bank transfer for Cash on Delivery orders, typically within 7 business days. Warranty claims are usually resolved through repair or replacement rather than a refund.
            </p>
          ),
        },
        {
          question: "Can I exchange an item instead of returning it?",
          answer: (
            <p>
              If you spot an issue at delivery — wrong color, wrong variant, or a damaged item — let the delivery agent know and contact us at{" "}
              <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a>; we'll arrange an exchange where stock allows, right away, instead of a straight return.
            </p>
          ),
        },
        {
          question: "What if I just changed my mind and don't want the item anymore?",
          answer: (
            <p>
              We don't accept change-of-mind returns. Your only opportunity to catch a damaged, defective, or wrong item is the inspection with the delivery agent, so please make sure you want the item before placing your order.
            </p>
          ),
        },
      ],
    },
    {
      id: "products",
      title: "Products & Stock",
      items: [
        {
          question: "Are your products genuine/authentic?",
          answer: (
            <p>
              Yes. We stand behind the authenticity of everything we sell — if you ever have a concern about a product's authenticity, contact us and we'll make it right.
            </p>
          ),
        },
        {
          question: "An item is showing \"Out of Stock.\" Will it come back?",
          answer: (
            <p>
              Often, yes. Tap "Notify Me" on the product page and we'll email or SMS you as soon as it's available again.
            </p>
          ),
        },
        {
          question: "How do I know if a product is compatible with my device?",
          answer: (
            <p>
              Check the specs table on the product page, which lists compatibility details. If you're still not sure, contact us at{" "}
              <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> before ordering — we're happy to check for you.
            </p>
          ),
        },
        {
          question: "Do product photos accurately represent what I'll receive?",
          answer: (
            <p>
              Yes — we use real photos of the actual products, not manufacturer stock images, so what you see is what you get.
            </p>
          ),
        },
      ],
    },
    {
      id: "support",
      title: "Account & Support",
      items: [
        {
          question: "Is safe to shop on your website?",
          answer: (
            <p>
              Yes. Our checkout is encrypted (HTTPS), and payments made via BanglaQR go directly through your own bank/MFS app — we never handle or store your banking credentials.
            </p>
          ),
        },
        {
          question: "Is my personal information kept private?",
          answer: (
            <p>
              Yes — see our Privacy Policy for full details on what we collect and how it's used. We don't sell your data to third parties.
            </p>
          ),
        },
        {
          question: "How do I contact customer support?",
          answer: (
            <div>
              <p>You can reach us through any of the following channels:</p>
              <ul>
                <li><strong>Phone:</strong> +880 1903022077</li>
                <li><strong>WhatsApp:</strong> +880 1903022077</li>
                <li><strong>Email:</strong> support@innoversely.com</li>
                <li><strong>Hours:</strong> 10:00 AM – 8:00 PM, Saturday – Thursday</li>
              </ul>
            </div>
          ),
        },
        {
          question: "I forgot my account password. What do I do?",
          answer: (
            <p>
              Use "Forgot Password" on the login page to reset it via SMS or email.
            </p>
          ),
        },
      ],
    },
  ];

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };


  // Filter items based on search query
  const filteredData = faqData
    .map((category) => {
      const matchedItems = category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof item.answer === "string" &&
            item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return {
        ...category,
        items: matchedItems,
      };
    })
    .filter((category) => category.items.length > 0);

  const isSearching = searchQuery.length > 0;

  return (
    <div className={styles.faqContainer}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">Home</Link>
        </li>
        <li className="breadcrumb__item">
          <span className="breadcrumb__current">FAQ</span>
        </li>
      </nav>

      {/* Header */}
      <header className={styles.faqHeader}>
        <h1 className={styles.faqTitle}>Frequently Asked Questions</h1>
        <p className={styles.faqSubtitle}>
          Find answers to common questions about ordering, payments, shipping, warranty, and account support at Innoverse Technologies.
        </p>

        {/* Search */}
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search questions or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Main Layout */}
      <div className={styles.faqLayout}>
        {/* Accordions */}
        <main className={styles.faqContent}>
          {filteredData.length > 0 ? (
            filteredData.map((category, catIndex) => (
              <section key={category.id} id={category.id} className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>{category.title}</h2>
                <div className={styles.accordionList}>
                  {category.items.map((item, itemIndex) => {
                    const isExpanded = expandedItems[`${catIndex}-${itemIndex}`] || isSearching;
                    return (
                      <div key={itemIndex} className={styles.accordionItem}>
                        <button
                          onClick={() => toggleItem(catIndex, itemIndex)}
                          className={`${styles.accordionHeader} ${
                            isExpanded ? styles.accordionHeaderActive : ""
                          }`}
                          aria-expanded={isExpanded}
                        >
                          <span>{item.question}</span>
                          <ChevronDown
                            className={`${styles.chevronIcon} ${
                              isExpanded ? styles.chevronIconActive : ""
                            }`}
                            size={18}
                          />
                        </button>
                        <div
                          className={`${styles.accordionBody} ${
                            isExpanded ? styles.accordionBodyActive : ""
                          }`}
                        >
                          <div className={styles.accordionContent}>{item.answer}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className={styles.noResults}>
              <HelpCircle size={48} style={{ margin: "0 auto var(--space-4) auto", opacity: 0.3 }} />
              <h3>No matching questions found</h3>
              <p>Try searching for different keywords or browse categories instead.</p>
            </div>
          )}
        </main>
      </div>

      {/* Contact Section */}
      <footer className={styles.contactBanner}>
        <div className={styles.contactInfo}>
          <h3>Still need help?</h3>
          <p>If you couldn't find the answers you were looking for, reach out directly.</p>
        </div>
        <div className={styles.contactGrid}>
          <div className={styles.contactMethod}>
            <Phone className={styles.contactIcon} size={16} />
            <a href="tel:+8801903022077">+880 1903022077</a>
          </div>
          <div className={styles.contactMethod}>
            <MessageSquare className={styles.contactIcon} size={16} />
            <a href="https://wa.me/8801903022077" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
          <div className={styles.contactMethod}>
            <Mail className={styles.contactIcon} size={16} />
            <a href="mailto:support@innoversely.com">support@innoversely.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
