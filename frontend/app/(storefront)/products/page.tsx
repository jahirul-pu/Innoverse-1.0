"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartContext";
import { productApi } from "@/lib/api";
import styles from "./ProductListing.module.css";

/* ── Reuse product card styles from homepage ── */
import homeStyles from "../Home.module.css";

import { Search } from "lucide-react";

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
const mockBrands = ["Amazfit", "Anker", "Baseus", "GoPro", "Govee", "JBL", "Keychron", "Logitech", "Razer", "Sony", "SoundCore", "TP-Link", "Ugreen", "XGIMI", "Xiaomi"];

const mockFallbackProducts = [
  { id: "1", name: "Wireless ANC Earbuds Pro", brand: { name: "SoundCore" }, price: 2990, compareAtPrice: 3450, stock: 45, slug: "wireless-anc-earbuds-pro", category: { name: "Audio", slug: "audio" }, images: [{ url: "" }] },
  { id: "2", name: "Magnetic USB-C Cable 2m", brand: { name: "Baseus" }, price: 490, stock: 200, slug: "magnetic-usb-c-cable", category: { name: "Accessories", slug: "accessories" }, images: [{ url: "" }] },
  { id: "3", name: "Smart LED Strip 5M RGB", brand: { name: "Govee" }, price: 1290, compareAtPrice: 1600, stock: 80, slug: "smart-led-strip", category: { name: "Smart Home", slug: "smart-home" }, images: [{ url: "" }] },
];

/* ── Product Card (Grid View) ── */
function ProductCardGrid({ product }: { product: any }) {
  const { addItem } = useCart();
  const price = Number(product.price);
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discount = comparePrice && comparePrice > price
    ? `−${Math.round(((comparePrice - price) / comparePrice) * 100)}%`
    : null;
  const primaryImage = product.images?.[0]?.url;

  return (
    <Link href={`/products/${product.slug}`} className={homeStyles["product-card"]} id={`listing-card-${product.id}`}>
      <div className={homeStyles["product-card__image"]}>
        {primaryImage ? (
          <img src={primaryImage} alt={product.name} className={homeStyles["product-card__img"]} />
        ) : (
          <div className={homeStyles["product-card__image-placeholder"]}>📦</div>
        )}
        {discount && (
          <span className={homeStyles["product-card__discount-badge"]}>{discount}</span>
        )}
        <button
          className={homeStyles["product-card__quick-add"]}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              await addItem(product.id, 1, undefined, {
                name: product.name,
                slug: product.slug,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                stock: product.stock,
                images: product.images,
                brand: product.brand,
              });
            } catch (err) {
              console.error(err);
            }
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <CartPlusIcon />
        </button>
      </div>
      <div className={homeStyles["product-card__body"]}>
        <span className={`${homeStyles["product-card__status"]} ${product.stock > 0 ? homeStyles["product-card__status--in-stock"] : homeStyles["product-card__status--out-of-stock"]}`}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
        <span className={homeStyles["product-card__brand"]}>{product.brand?.name}</span>
        <span className={homeStyles["product-card__name"]}>{product.name}</span>
        <div className={homeStyles["product-card__pricing"]}>
          <span className={homeStyles["product-card__price"]}>৳{price.toLocaleString("en-BD")}</span>
          {comparePrice && <span className={homeStyles["product-card__price-original"]}>৳{comparePrice.toLocaleString("en-BD")}</span>}
          {discount && <span className={homeStyles["product-card__price-discount"]}>{discount}</span>}
        </div>
      </div>
    </Link>
  );
}

/* ── Product Card (List View) ── */
function ProductCardList({ product }: { product: any }) {
  const { addItem } = useCart();
  const price = Number(product.price);
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discount = comparePrice && comparePrice > price
    ? `−${Math.round(((comparePrice - price) / comparePrice) * 100)}%`
    : null;
  const primaryImage = product.images?.[0]?.url;

  return (
    <Link href={`/products/${product.slug}`} className={styles["product-card-list"]} id={`listing-list-${product.id}`}>
      <div className={styles["product-card-list__image"]}>
        {primaryImage ? (
          <img src={primaryImage} alt={product.name} className={styles["product-card-list__img"]} />
        ) : (
          <div className={styles["product-card-list__image-placeholder"]}>📦</div>
        )}
      </div>
      <div className={styles["product-card-list__body"]}>
        <span className={`${styles["product-card-list__status"]} ${product.stock > 0 ? styles["product-card-list__status--in-stock"] : styles["product-card-list__status--out-of-stock"]}`}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
        <span className={styles["product-card-list__brand"]}>{product.brand?.name}</span>
        <span className={styles["product-card-list__name"]}>{product.name}</span>
        {product.shortDescription && <span className={styles["product-card-list__desc"]}>{product.shortDescription}</span>}
        <div className={styles["product-card-list__footer"]}>
          <div className={styles["product-card-list__pricing"]}>
            <span className={styles["product-card-list__price"]}>৳{price.toLocaleString("en-BD")}</span>
            {comparePrice && <span className={styles["product-card-list__price-original"]}>৳{comparePrice.toLocaleString("en-BD")}</span>}
            {discount && <span className={styles["product-card-list__discount"]}>{discount}</span>}
          </div>
          <button
            className="btn btn--primary btn--sm"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                await addItem(product.id, 1, undefined, {
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  stock: product.stock,
                  images: product.images,
                  brand: product.brand,
                });
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ── Filter Sidebar Content ── */
interface FilterContentProps {
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
  allCategories?: any[];
}

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
  allCategories = [],
}: FilterContentProps) {
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
          {allCategories.map((cat: any) => (
            <label key={cat.slug} className={styles["filter-option"]}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className={styles["filter-option__checkbox"]}
              />
              {cat.name}
              <span className={styles["filter-option__count"]}>
                {cat._count?.products ?? ""}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className={styles["filter-group"]}>
        <div className={styles["filter-group__title"]}>Brand</div>
        <div className={styles["filter-group__options"]}>
          {mockBrands.map((brand) => (
            <label key={brand} className={styles["filter-option"]}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className={styles["filter-option__checkbox"]}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Products Page ── */
export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Initialize filters from searchParams
  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      setSelectedCategories([catParam]);
    }
  }, [searchParams]);

  // Load categories and products
  useEffect(() => {
    async function loadFilters() {
      try {
        const res = await fetch("http://localhost:4000/api/categories").then((r) => r.json());
        if (res && res.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error("Failed to load categories filter list", err);
      }
    }
    loadFilters();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const searchVal = searchParams.get("q") || searchParams.get("search") || undefined;
        const catVal = selectedCategories.join(",") || undefined;
        const brandVal = selectedBrands.join(",") || undefined;

        const filters: any = {
          page: currentPage,
          limit: 12,
          sort: sortBy,
          category: catVal,
          brand: brandVal,
          search: searchVal,
          minPrice: priceMin ? Number(priceMin) : undefined,
          maxPrice: priceMax ? Number(priceMax) : undefined,
          inStock: availabilityFilter === "in-stock" ? true : availabilityFilter === "out-of-stock" ? false : undefined,
        };

        const res = await productApi.list(filters);
        if (res && res.products) {
          setProducts(res.products);
          setTotalPages(res.pagination.totalPages);
          setTotalProducts(res.pagination.total);
        } else {
          setProducts(mockFallbackProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products list from API, using fallback list", err);
        setProducts(mockFallbackProducts);
        setTotalProducts(mockFallbackProducts.length);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [currentPage, sortBy, selectedBrands, selectedCategories, availabilityFilter, priceMin, priceMax, searchParams]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b: string) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c: string) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const activeFilterCount = selectedBrands.length + selectedCategories.length + (availabilityFilter !== "all" ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setAvailabilityFilter("all");
    setPriceMin("");
    setPriceMax("");
    setCurrentPage(1);
  };

  const filterProps = {
    selectedBrands, toggleBrand,
    selectedCategories, toggleCategory,
    availabilityFilter, setAvailabilityFilter,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    allCategories: categories,
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
        <h1 className={styles["listing-page__title"]}>
          {searchParams.get("q") ? `Search Results for "${searchParams.get("q")}"` : "All Products"}
        </h1>
        <span className={styles["listing-page__count"]}>
          {totalProducts} products
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
          {loading ? (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-tertiary)", fontFamily: "var(--font-data)" }}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className={styles["listing-empty"]}>
              <div className={styles["listing-empty__icon"]}><Search size={48} style={{ opacity: 0.4 }} /></div>
              <h3 className={styles["listing-empty__title"]}>No products found</h3>
              <p className={styles["listing-empty__text"]}>Try adjusting your filters or search terms.</p>
              <button className="btn btn--primary" onClick={clearAllFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={`${styles["listing-grid__products"]} ${viewMode === "list" ? styles["listing-grid__products--list"] : ""}`}>
              {products.map((product) =>
                viewMode === "grid" ? (
                  <ProductCardGrid key={product.id} product={product} />
                ) : (
                  <ProductCardList key={product.id} product={product} />
                )
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className={styles.pagination}>
              <button className={styles.pagination__btn} disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeftIcon />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    className={`${styles.pagination__btn} ${currentPage === page ? styles["pagination__btn--active"] : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
              <button className={styles.pagination__btn} disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
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
            Show {totalProducts} Results
          </button>
        </div>
      </div>
    </div>
  );
}
