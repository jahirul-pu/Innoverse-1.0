import Link from "next/link";
import { 
  HelpCircle, 
  PhoneCall, 
  FileText, 
  ArrowRight, 
  Cpu, 
  ShoppingBag, 
  TrendingUp, 
  ShieldCheck, 
  Eye, 
  Wallet, 
  Tag 
} from "lucide-react";
import styles from "./About.module.css";

export const metadata = {
  title: "About Us | Innoverse Technologies",
  description: "Learn more about Innoverse Technologies, our mission, vision, story, and what makes us different as an online-only gadgets retailer in Bangladesh.",
};

export default function AboutUsPage() {
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">Home</Link>
        </li>
        <li className="breadcrumb__item">
          <span className="breadcrumb__current">About Us</span>
        </li>
      </nav>

      {/* Stylized Hero Section */}
      <header className={styles.hero}>
        <h1 className={styles.title}>Innoverse Technologies</h1>
        <p className={styles.subtitle}>
          We built Innoverse for one reason: buying gadgets and electronics online in Bangladesh should feel as reliable as walking into a shop you trust — even though we don't have one.
        </p>
      </header>

      {/* Main Layout */}
      <div className={styles.layout}>
        {/* Section 1: What We Do */}
        <section className={styles.section} id="what-we-do">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What We Do</h2>
          </div>
          <div className={styles.text}>
            <p>
              Innoverse Technologies is an online-only retailer of gadgets and electronics, built for Bangladesh. No physical storefront, no showroom — just a website designed to be fast, clear, and honest about what you're getting, from the moment you land on a product page to the moment it's in your hands.
            </p>
            <p>
              We carry everything from everyday essentials — chargers, earbuds, smart accessories — to more niche and hard-to-find gadgets for people who actually geek out over specs. Whichever one you are, the experience should feel the same: straightforward, and worth trusting.
            </p>
          </div>
        </section>

        {/* Section 2: Who We're For (Stylized Cards) */}
        <section className={styles.section} id="who-were-for">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Who We're For</h2>
          </div>
          <div className={styles.audienceGrid}>
            <div className={styles.audienceCard}>
              <div className={styles.audienceIcon}>
                <Cpu size={24} />
              </div>
              <h3 className={styles.audienceTitle}>Gadget Enthusiasts</h3>
              <p className={styles.audienceText}>
                For the early adopters looking for unique, niche, or hard-to-find electronics that aren't sitting on every retail shelf in Dhaka.
              </p>
            </div>
            <div className={styles.audienceCard}>
              <div className={styles.audienceIcon}>
                <ShoppingBag size={24} />
              </div>
              <h3 className={styles.audienceTitle}>Everyday Customers</h3>
              <p className={styles.audienceText}>
                For buyers who just want a reliable charger, a decent pair of earbuds, or a smart home accessory — without the runaround.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid Section */}
        <section className={styles.statGrid}>
          <div className={styles.statItem}>
            <div className={styles.statVal}>100%</div>
            <div className={styles.statLabel}>Authentic Products</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statVal}>Pathao</div>
            <div className={styles.statLabel}>Delivery Partner</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statVal}>BanglaQR</div>
            <div className={styles.statLabel}>Payment Standard</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statVal}>৳ 0</div>
            <div className={styles.statLabel}>Min Order Value</div>
          </div>
        </section>

        {/* Section 3: What Makes Us Different (Interactive Grid) */}
        <section className={styles.section} id="what-makes-us-different">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What Makes Us Different</h2>
          </div>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <TrendingUp size={18} />
              </div>
              <h4 className={styles.featureTitle}>A Catalog That Keeps Up</h4>
              <p className={styles.featureText}>
                We stay close to what's actually in demand, so what you find here tends to be current, not leftover stock.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ShieldCheck size={18} />
              </div>
              <h4 className={styles.featureTitle}>Authentic or Nothing</h4>
              <p className={styles.featureText}>
                We verify our supply chains and stand behind the authenticity of everything we sell.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Eye size={18} />
              </div>
              <h4 className={styles.featureTitle}>Inspect Before Accepting</h4>
              <p className={styles.featureText}>
                Inspect your delivery in front of the courier agent. If anything is wrong, reject it on the spot.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Wallet size={18} />
              </div>
              <h4 className={styles.featureTitle}>Secure Payments</h4>
              <p className={styles.featureText}>
                Pay with Cash on Delivery or BanglaQR standard scans directly from your own banking or MFS apps.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Tag size={18} />
              </div>
              <h4 className={styles.featureTitle}>Transparent Pricing</h4>
              <p className={styles.featureText}>
                All prices are VAT-inclusive with no surprise charges or hidden markups added at checkout.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Our Promise (Styled Quote Box) */}
        <section className={styles.section} id="our-promise">
          <div className={styles.promiseBox}>
            <p className={styles.promiseText}>
              "Since there's no shop window for you to look through, this website has to do all the work of earning your trust — through clear information, honest delivery timelines, and a straightforward process when something needs fixing. That's the standard we hold ourselves to on every order, not just the big ones."
            </p>
          </div>
        </section>

        {/* Section 5: Our Story */}
        <section className={styles.section} id="our-story">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
          </div>
          <div className={styles.text}>
            <p>
              Founded in 2026 by a group of gadget enthusiasts and tech developers, Innoverse Technologies started from a simple realization: buying authentic electronics online in Bangladesh shouldn't feel like a gamble. We wanted to eliminate the runaround, the stock discrepancies, and the hidden pricing surprises.
            </p>
            <p>
              By building an online-only fulfillment network centered around nationwide delivery and digital BanglaQR standard transactions, we set out to build a platform that focuses entirely on checkout honesty, logistics transparency, and customer-first operations.
            </p>
          </div>
        </section>

        {/* Section 6: Get in Touch */}
        <section className={styles.section} id="get-in-touch">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Get in Touch</h2>
          </div>
          <div className={styles.text}>
            <p>
              Have a question before you order, or want to know more about us? Visit our <Link href="/contact" className={styles.link}>Contact Us</Link> page, check the <Link href="/faq" className={styles.link}>FAQ</Link>, or reach us directly at <a href="tel:+8801903022077" className={styles.link}>+880 1903022077</a> (phone or WhatsApp).
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
      </div>
    </div>
  );
}
