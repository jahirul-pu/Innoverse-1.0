"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ProductListing.module.css";

/* ── Reuse product card styles from homepage ── */
import homeStyles from "../Home.module.css";

/* ── Icons ── */
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" />
    <line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const CartPlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

/* ── Mock Data ── */
interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  inStock: boolean;
  href: string;
  category: string;
  description?: string;
}

const allProducts: Product[] = [
  { id: 1, name: "Wireless ANC Earbuds Pro", brand: "SoundCore", price: "৳2,990", originalPrice: "৳3,450", discount: "−13%", inStock: true, href: "/products/wireless-anc-earbuds-pro", category: "Audio", description: "40dB active noise cancellation with 32-hour battery life." },
  { id: 2, name: "Magnetic USB-C Cable 2m", brand: "Baseus", price: "৳490", inStock: true, href: "/products/magnetic-usb-c-cable", category: "Accessories", description: "Braided nylon cable with magnetic tip for easy connection." },
  { id: 3, name: "Smart LED Strip 5M RGB", brand: "Govee", price: "৳1,290", originalPrice: "৳1,600", discount: "−19%", inStock: true, href: "/products/smart-led-strip", category: "Smart Home", description: "App-controlled RGB strip with music sync and 16M colors." },
  { id: 4, name: "Fitness Band 7 Pro", brand: "Amazfit", price: "৳3,490", inStock: true, href: "/products/fitness-band-7-pro", category: "Wearables", description: "SpO2, heart rate, 120+ sport modes, 18-day battery." },
  { id: 5, name: "Mini Bluetooth Speaker", brand: "JBL", price: "৳2,190", originalPrice: "৳2,500", discount: "−12%", inStock: false, href: "/products/mini-bluetooth-speaker", category: "Audio", description: "Waterproof portable speaker with 10-hour playtime." },
  { id: 6, name: "65W GaN Charger", brand: "Ugreen", price: "৳1,790", inStock: true, href: "/products/65w-gan-charger", category: "Accessories", description: "Compact GaN charger with 3 ports. Powers laptops and phones." },
  { id: 7, name: "Webcam 2K AutoFocus", brand: "Logitech", price: "৳4,990", originalPrice: "৳5,500", discount: "−9%", inStock: true, href: "/products/webcam-2k-autofocus", category: "Cameras", description: "2K resolution with autofocus and dual microphones." },
  { id: 8, name: "Smart Plug Wi-Fi 4 Pack", brand: "TP-Link", price: "৳2,290", inStock: true, href: "/products/smart-plug-wifi", category: "Smart Home", description: "Voice-controlled plugs compatible with Alexa and Google." },
  { id: 9, name: "Noise Cancelling Headphones", brand: "Sony", price: "৳8,990", originalPrice: "৳12,500", discount: "−28%", inStock: true, href: "/products/nc-headphones", category: "Audio", description: "Industry-leading ANC with 30-hour battery and LDAC." },
  { id: 10, name: "Smart Watch Ultra", brand: "Amazfit", price: "৳6,490", originalPrice: "৳8,900", discount: "−27%", inStock: true, href: "/products/smart-watch-ultra", category: "Wearables", description: "AMOLED display, GPS, 14-day battery, 100m water resistance." },
  { id: 11, name: "Portable Projector Mini", brand: "XGIMI", price: "৳15,990", originalPrice: "৳19,900", discount: "−20%", inStock: true, href: "/products/portable-projector", category: "Cameras", description: "1080p portable projector with built-in speakers and Android TV." },
  { id: 12, name: "Mechanical Keyboard RGB", brand: "Keychron", price: "৳5,490", originalPrice: "৳6,900", discount: "−20%", inStock: false, href: "/products/mechanical-keyboard", category: "Accessories", description: "Hot-swappable switches, wireless Bluetooth, Mac/Win compatible." },
  { id: 13, name: "TWS Gaming Earbuds", brand: "Razer", price: "৳4,990", inStock: true, href: "/products/tws-gaming-earbuds", category: "Audio", description: "60ms low-latency gaming mode with THX spatial audio." },
  { id: 14, name: "Desk Lamp Smart LED", brand: "Xiaomi", price: "৳2,490", originalPrice: "৳2,900", discount: "−14%", inStock: true, href: "/products/desk-lamp-smart", category: "Smart Home", description: "Color temperature adjustable, app control, eye-care certified." },
  { id: 15, name: "Action Camera 4K", brand: "GoPro", price: "৳22,990", inStock: true, href: "/products/action-camera-4k", category: "Cameras", description: "4K60 video, HyperSmooth stabilization, waterproof to 10m." },
  { id: 16, name: "USB-C Hub 7-in-1", brand: "Anker", price: "৳3,290", originalPrice: "৳3,800", discount: "−13%", inStock: true, href: "/products/usb-c-hub-7in1", category: "Accessories", description: "HDMI 4K, USB-A 3.0, SD card, 100W PD pass-through." },
];

const brands = ["Amazfit", "Anker", "Baseus", "GoPro", "Govee", "JBL", "Keychron", "Logitech", "Razer", "Sony", "SoundCore", "TP-Link", "Ugreen", "XGIMI", "Xiaomi"];
const categoryList = ["Audio", "Smart Home", "Wearables", "Accessories", "Cameras", "Gaming"];

/* ── Product Card (Grid View) ── */
function ProductCardGrid({ product }: { product: Product }) {
  return (
    <Link href={product.href} className={homeStyles["product-card"]} id={`listing-card-${product.id}`}>
      <div className={homeStyles["product-card__image"]}>
        <div className={homeStyles["product-card__image-placeholder"]}>📦</div>
        {product.discount && (
          <span className={homeStyles["product-card__discount-badge"]}>{product.discount}</span>
        )}
        <button
          className={homeStyles["product-card__quick-add"]}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          aria-label={`Add ${product.name} to cart`}
        >
          <CartPlusIcon />
        </button>
      </div>
      <div className={homeStyles["product-card__body"]}>
        <span className={`${homeStyles["product-card__status"]} ${product.inStock ? homeStyles["product-card__status--in-stock"] : homeStyles["product-card__status--out-of-stock"]}`}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
        <span className={homeStyles["product-card__brand"]}>{product.brand}</span>
        <span className={homeStyles["product-card__name"]}>{product.name}</span>
        <div className={homeStyles["product-card__pricing"]}>
          <span className={homeStyles["product-card__price"]}>{product.price}</span>
          {product.originalPrice && <span className={homeStyles["product-card__price-original"]}>{product.originalPrice}</span>}
          {product.discount && <span className={homeStyles["product-card__price-discount"]}>{product.discount}</span>}
        </div>
      </div>
    </Link>
  );
}

/* ── Product Card (List View) ── */
function ProductCardList({ product }: { product: Product }) {
  return (
    <Link href={product.href} className={styles["product-card-list"]} id={`listing-list-${product.id}`}>
      <div className={styles["product-card-list__image"]}>
        <div className={styles["product-card-list__image-placeholder"]}>📦</div>
      </div>
      <div className={styles["product-card-list__body"]}>
        <span className={`${styles["product-card-list__status"]} ${product.inStock ? styles["product-card-list__status--in-stock"] : styles["product-card-list__status--out-of-stock"]}`}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
        <span className={styles["product-card-list__brand"]}>{product.brand}</span>
        <span className={styles["product-card-list__name"]}>{product.name}</span>
        {product.description && <span className={styles["product-card-list__desc"]}>{product.description}</span>}
        <div className={styles["product-card-list__footer"]}>
          <div className={styles["product-card-list__pricing"]}>
            <span className={styles["product-card-list__price"]}>{product.price}</span>
            {product.originalPrice && <span className={styles["product-card-list__price-original"]}>{product.originalPrice}</span>}
            {product.discount && <span className={styles["product-card-list__discount"]}>{product.discount}</span>}
          </div>
          <button className="btn btn--primary btn--sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ── Filter Sidebar Content ── */
function FilterContent({
  selectedBrands,
  toggleBrand,
  selectedCategories,
  toggleCategory,
  availabilityFilter,
  setAvailabilityFilter,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
}: {
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  selectedCategories: string[];
  toggleCategory: (c: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (v: string) => void;
  priceMin: string;
  setPriceMin: (v: string) => void;
  priceMax: string;
  setPriceMax: (v: string) => void;
}) {
  return (
    <>
      {/* Availability */}
      <div className={styles["filter-group"]}>
        <div className={styles["filter-group__title"]}>Availability</div>
        <div className={styles["filter-group__options"]}>
          {["all", "in-stock", "out-of-stock"].map((opt) => (
            <label key={opt} className={styles["filter-option"]}>
              <input
                type="radio"
                name="availability"
                checked={availabilityFilter === opt}
                onChange={() => setAvailabilityFilter(opt)}
                className={styles["filter-option__checkbox"]}
              />
              {opt === "all" ? "All" : opt === "in-stock" ? "In Stock" : "Out of Stock"}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className={styles["filter-group"]}>
        <div className={styles["filter-group__title"]}>Price Range</div>
        <div className={styles["price-range"]}>
          <div className={styles["price-range__inputs"]}>
            <input
              type="number"
              className={styles["price-range__input"]}
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <span className={styles["price-range__separator"]}>—</span>
            <input
              type="number"
              className={styles["price-range__input"]}
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className={styles["filter-group"]}>
        <div className={styles["filter-group__title"]}>Category</div>
        <div className={styles["filter-group__options"]}>
          {categoryList.map((cat) => (
            <label key={cat} className={styles["filter-option"]}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className={styles["filter-option__checkbox"]}
              />
              {cat}
              <span className={styles["filter-option__count"]}>
                {allProducts.filter((p) => p.category === cat).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className={styles["filter-group"]}>
        <div className={styles["filter-group__title"]}>Brand</div>
        <div className={styles["filter-group__options"]}>
          {brands.map((brand) => (
            <label key={brand} className={styles["filter-option"]}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className={styles["filter-option__checkbox"]}
              />
              {brand}
              <span className={styles["filter-option__count"]}>
                {allProducts.filter((p) => p.brand === brand).length}
              </span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Products Page ── */
export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Apply filters
  let filteredProducts = allProducts.filter((p) => {
    if (availabilityFilter === "in-stock" && !p.inStock) return false;
    if (availabilityFilter === "out-of-stock" && p.inStock) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
    return true;
  });

  // Sort
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => parseInt(a.price.replace(/[^\d]/g, "")) - parseInt(b.price.replace(/[^\d]/g, ""))
    );
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => parseInt(b.price.replace(/[^\d]/g, "")) - parseInt(a.price.replace(/[^\d]/g, ""))
    );
  }

  const activeFilterCount = selectedBrands.length + selectedCategories.length + (availabilityFilter !== "all" ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setAvailabilityFilter("all");
    setPriceMin("");
    setPriceMax("");
  };

  const filterProps = {
    selectedBrands, toggleBrand,
    selectedCategories, toggleCategory,
    availabilityFilter, setAvailabilityFilter,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
  };

  return (
    <div className={`container ${styles["listing-page"]}`}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">Home</Link>
        </li>
        <li className="breadcrumb__item">
          <span className="breadcrumb__current">All Products</span>
        </li>
      </nav>

      {/* Page Header */}
      <div className={styles["listing-page__header"]}>
        <h1 className={styles["listing-page__title"]}>All Products</h1>
        <span className={styles["listing-page__count"]}>
          {filteredProducts.length} products
        </span>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className={styles["active-filters"]}>
          {selectedCategories.map((cat) => (
            <span key={cat} className={styles["active-filter"]}>
              {cat}
              <button className={styles["active-filter__remove"]} onClick={() => toggleCategory(cat)}>
                <CloseIcon />
              </button>
            </span>
          ))}
          {selectedBrands.map((brand) => (
            <span key={brand} className={styles["active-filter"]}>
              {brand}
              <button className={styles["active-filter__remove"]} onClick={() => toggleBrand(brand)}>
                <CloseIcon />
              </button>
            </span>
          ))}
          {availabilityFilter !== "all" && (
            <span className={styles["active-filter"]}>
              {availabilityFilter === "in-stock" ? "In Stock" : "Out of Stock"}
              <button className={styles["active-filter__remove"]} onClick={() => setAvailabilityFilter("all")}>
                <CloseIcon />
              </button>
            </span>
          )}
          <button className={styles["clear-filters"]} onClick={clearAllFilters}>
            Clear all
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className={styles["listing-toolbar"]}>
        <div className={styles["listing-toolbar__left"]}>
          <button
            className={styles["listing-toolbar__filter-btn"]}
            onClick={() => setFilterDrawerOpen(true)}
            id="filter-toggle-btn"
          >
            <FilterIcon />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        <div className={styles["listing-toolbar__right"]}>
          <div className={styles["listing-toolbar__sort"]}>
            <span className={styles["listing-toolbar__sort-label"]}>Sort by:</span>
            <select
              className={styles["listing-toolbar__sort-select"]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="best-selling">Best Selling</option>
              <option value="top-rated">Top Rated</option>
            </select>
          </div>
          <button
            className={`${styles["listing-toolbar__view-btn"]} ${viewMode === "grid" ? styles["listing-toolbar__view-btn--active"] : ""}`}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <GridIcon />
          </button>
          <button
            className={`${styles["listing-toolbar__view-btn"]} ${viewMode === "list" ? styles["listing-toolbar__view-btn--active"] : ""}`}
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* Layout: Sidebar + Products */}
      <div className={styles["listing-layout"]}>
        {/* Desktop Sidebar */}
        <aside className={`${styles["filter-sidebar"]} ${styles["filter-sidebar--visible"]}`} id="filter-sidebar">
          <FilterContent {...filterProps} />
        </aside>

        {/* Product Grid/List */}
        <div className={styles["listing-grid"]}>
          {filteredProducts.length === 0 ? (
            <div className={styles["listing-empty"]}>
              <div className={styles["listing-empty__icon"]}>🔍</div>
              <h3 className={styles["listing-empty__title"]}>No products found</h3>
              <p className={styles["listing-empty__text"]}>Try adjusting your filters or search terms.</p>
              <button className="btn btn--primary" onClick={clearAllFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={`${styles["listing-grid__products"]} ${viewMode === "list" ? styles["listing-grid__products--list"] : ""}`}>
              {filteredProducts.map((product) =>
                viewMode === "grid" ? (
                  <ProductCardGrid key={product.id} product={product} />
                ) : (
                  <ProductCardList key={product.id} product={product} />
                )
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className={styles.pagination}>
              <button className={styles.pagination__btn} disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeftIcon />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`${styles.pagination__btn} ${currentPage === page ? styles["pagination__btn--active"] : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <span className={styles.pagination__ellipsis}>…</span>
              <button className={styles.pagination__btn} onClick={() => setCurrentPage(8)}>8</button>
              <button className={styles.pagination__btn} disabled={currentPage === 8} onClick={() => setCurrentPage((p) => p + 1)}>
                <ChevronRightIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterDrawerOpen && (
        <div className="overlay overlay--visible" onClick={() => setFilterDrawerOpen(false)} />
      )}
      <div className={`${styles["filter-drawer"]} ${filterDrawerOpen ? styles["filter-drawer--open"] : ""}`}>
        <div className={styles["filter-drawer__header"]}>
          <h3 className={styles["filter-drawer__title"]}>Filters</h3>
          <button className={styles["filter-drawer__close"]} onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles["filter-drawer__body"]}>
          <FilterContent {...filterProps} />
        </div>
        <div className={styles["filter-drawer__footer"]}>
          <button className="btn btn--secondary btn--block" onClick={clearAllFilters}>Clear All</button>
          <button className="btn btn--primary btn--block" onClick={() => setFilterDrawerOpen(false)}>
            Show {filteredProducts.length} Results
          </button>
        </div>
      </div>
    </div>
  );
}
