"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/components/providers/AuthContext";
import { useCart } from "@/components/providers/CartContext";
import styles from "./Header.module.css";

/* ── SVG Icon Components ── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" /><path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/* ── Navigation Categories ── */
const categories = [
  {
    name: "Audio",
    href: "/category/audio",
    subcategories: [
      { name: "Earbuds", href: "/category/audio/earbuds" },
      { name: "Headphones", href: "/category/audio/headphones" },
      { name: "Speakers", href: "/category/audio/speakers" },
      { name: "Microphones", href: "/category/audio/microphones" },
    ],
  },
  {
    name: "Smart Home",
    href: "/category/smart-home",
    subcategories: [
      { name: "Smart Plugs", href: "/category/smart-home/plugs" },
      { name: "Smart Lights", href: "/category/smart-home/lights" },
      { name: "Cameras", href: "/category/smart-home/cameras" },
      { name: "Hubs & Controllers", href: "/category/smart-home/hubs" },
    ],
  },
  {
    name: "Wearables",
    href: "/category/wearables",
    subcategories: [
      { name: "Smartwatches", href: "/category/wearables/smartwatches" },
      { name: "Fitness Bands", href: "/category/wearables/fitness" },
      { name: "Smart Glasses", href: "/category/wearables/glasses" },
    ],
  },
  {
    name: "Accessories",
    href: "/category/accessories",
    subcategories: [
      { name: "Chargers & Cables", href: "/category/accessories/chargers" },
      { name: "Cases & Covers", href: "/category/accessories/cases" },
      { name: "Power Banks", href: "/category/accessories/power-banks" },
      { name: "Mounts & Stands", href: "/category/accessories/mounts" },
    ],
  },
];

export default function Header() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { items: cartItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const headerRef = useRef<HTMLElement>(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${isScrolled ? styles["header--scrolled"] : ""}`}
        id="site-header"
      >
        {/* Top Bar — visible on desktop */}
        <div className={styles.header__top_bar || styles["header__top-bar"]}>
          <div className={styles["header__top-bar-inner"]}>
            <span>🇧🇩 Delivering across Bangladesh via Pathao</span>
            <span>COD & BanglaQR accepted</span>
          </div>
        </div>

        {/* Main Header */}
        <div className={styles.header__main}>
          {/* Mobile Menu Button */}
          <button
            className={styles["header__menu-btn"]}
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
            id="mobile-menu-btn"
          >
            <MenuIcon />
          </button>

          {/* Logo */}
          <Link href="/" className={styles.header__logo} id="header-logo">
            <div className={styles["header__logo-icon"]}>I</div>
            <div className={styles["header__logo-text"]}>
              Inno<span>verse</span>
            </div>
          </Link>

          {/* Search Bar — hidden on mobile, shown tablet+ */}
          <form
            className={styles.header__search}
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
          >
            <span className={styles["header__search-icon"]}>
              <SearchIcon />
            </span>
            <input
              type="search"
              className={styles["header__search-input"]}
              placeholder="Search gadgets & brands (Press Enter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="header-search"
              aria-label="Search products"
            />
          </form>

          {/* Action Buttons */}
          <div className={styles.header__actions}>
            {/* Theme Toggle */}
            <button
              className={styles["header__action-btn"]}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              id="theme-toggle"
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className={styles["header__action-btn"]}
              aria-label="Wishlist"
              id="header-wishlist"
            >
              <HeartIcon />
            </Link>

            {/* Account */}
            <Link
              href={user ? "/account" : "/auth"}
              className={styles["header__action-btn"]}
              aria-label="Account"
              id="header-account"
            >
              <UserIcon />
            </Link>

            {/* Cart */}
            <button
              className={styles["header__action-btn"]}
              aria-label="Shopping cart"
              id="header-cart"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className={styles["header__cart-badge"]}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.header__nav} aria-label="Main navigation" id="main-nav">
          <div className={styles["header__nav-inner"]}>
            <Link href="/" className={`${styles["header__nav-link"]} ${styles["header__nav-link--active"]}`}>
              Home
            </Link>
            <Link href="/products" className={styles["header__nav-link"]}>
              All Products
            </Link>
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className={styles["header__nav-link"]}>
                {cat.name}
                <ChevronDownIcon />
              </Link>
            ))}
            <Link href="/deals" className={styles["header__nav-link"]} style={{ color: "var(--color-signal-amber)" }}>
              🔥 Deals
            </Link>
            <Link href="/new-arrivals" className={styles["header__nav-link"]}>
              New Arrivals
            </Link>
            <Link href="/brands" className={styles["header__nav-link"]}>
              Brands
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div
          className={`overlay ${mobileNavOpen ? "overlay--visible" : ""}`}
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <nav
        className={`${styles["mobile-nav"]} ${mobileNavOpen ? styles["mobile-nav--open"] : ""}`}
        aria-label="Mobile navigation"
        id="mobile-nav"
      >
        <div className={styles["mobile-nav__header"]}>
          <Link href="/" className={styles.header__logo} onClick={() => setMobileNavOpen(false)}>
            <div className={styles["header__logo-icon"]}>I</div>
            <div className={styles["header__logo-text"]}>
              Inno<span>verse</span>
            </div>
          </Link>
          <button
            className={styles["mobile-nav__close"]}
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <CloseIcon />
          </button>
        </div>

        <form
          className={styles["mobile-nav__search"]}
          onSubmit={(e) => {
            e.preventDefault();
            if (mobileSearchQuery.trim()) {
              router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
              setMobileNavOpen(false);
            }
          }}
        >
          <input
            type="search"
            className="input input--search"
            placeholder="Search (Press Enter)..."
            value={mobileSearchQuery}
            onChange={(e) => setMobileSearchQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <div className={styles["mobile-nav__links"]}>
          <Link href="/" className={styles["mobile-nav__link"]} onClick={() => setMobileNavOpen(false)}>
            Home
          </Link>
          <Link href="/products" className={styles["mobile-nav__link"]} onClick={() => setMobileNavOpen(false)}>
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={styles["mobile-nav__link"]}
              onClick={() => setMobileNavOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/deals"
            className={styles["mobile-nav__link"]}
            onClick={() => setMobileNavOpen(false)}
            style={{ color: "var(--color-signal-amber)" }}
          >
            🔥 Deals
          </Link>
          <Link href="/new-arrivals" className={styles["mobile-nav__link"]} onClick={() => setMobileNavOpen(false)}>
            New Arrivals
          </Link>
          <Link href="/brands" className={styles["mobile-nav__link"]} onClick={() => setMobileNavOpen(false)}>
            Brands
          </Link>
        </div>

        <div className={styles["mobile-nav__footer"]}>
          <button className="btn btn--secondary btn--block" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
          {user ? (
            <Link href="/account" className="btn btn--secondary btn--block" onClick={() => setMobileNavOpen(false)}>
              👤 My Account
            </Link>
          ) : (
            <Link href="/auth" className="btn btn--primary btn--block" onClick={() => setMobileNavOpen(false)}>
              Sign In / Register
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
