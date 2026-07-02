"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/components/providers/AuthContext";
import { useCart } from "@/components/providers/CartContext";
import CartDrawer from "@/components/storefront/CartDrawer/CartDrawer";
import styles from "./Header.module.css";

import { 
  Search as SearchIcon, 
  User as UserIcon, 
  Heart as HeartIcon, 
  ShoppingCart as CartIcon, 
  Sun as SunIcon, 
  Moon as MoonIcon, 
  Menu as MenuIcon, 
  X as CloseIcon, 
  ChevronDown as ChevronDownIcon 
} from "lucide-react";

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
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
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
              onClick={() => setCartDrawerOpen(true)}
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

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
}
