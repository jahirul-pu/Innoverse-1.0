"use client";

import { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartContext";
import { productApi } from "@/lib/api";
import styles from "../../products/ProductListing.module.css";
import homeStyles from "../../Home.module.css";
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

/* ── Product Card Grid ── */
function ProductCardGrid({ product }: { product: any }) {
  const { addItem } = useCart();
  const price = Number(product.price);
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discount = comparePrice && comparePrice > price
    ? `−${Math.round(((comparePrice - price) / comparePrice) * 100)}%`
    : null;
  const primaryImage = product.images?.[0]?.url;

  return (
    <Link href={`/products/${product.slug}`} className={homeStyles["product-card"]}>
      <div className={homeStyles["product-card__image"]}>
        {primaryImage ? (
          <img src={primaryImage} alt={product.name} className={homeStyles["product-card__img"]} />
        ) : (
          <div className={homeStyles["product-card__image-placeholder"]}>📦</div>
        )}
        {discount && <span className={homeStyles["product-card__discount-badge"]}>{discount}</span>}
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

/* ── Product Card List ── */
function ProductCardList({ product }: { product: any }) {
  const { addItem } = useCart();
  const price = Number(product.price);
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discount = comparePrice && comparePrice > price
    ? `−${Math.round(((comparePrice - price) / comparePrice) * 100)}%`
    : null;
  const primaryImage = product.images?.[0]?.url;

  return (
    <div className={styles["product-card-list"]}>
      <Link href={`/products/${product.slug}`} className={styles["product-card-list__image-wrapper"]}>
        {primaryImage ? (
          <img src={primaryImage} alt={product.name} className={styles["product-card-list__img"]} />
        ) : (
          <div className={homeStyles["product-card__image-placeholder"]} style={{ fontSize: "2rem" }}>📦</div>
        )}
        {discount && <span className={homeStyles["product-card__discount-badge"]}>{discount}</span>}
      </Link>
      <div className={styles["product-card-list__body"]}>
        <div className={styles["product-card-list__header-row"]}>
          <span className={styles["product-card-list__brand"]}>{product.brand?.name}</span>
          <span className={`${homeStyles["product-card__status"]} ${product.stock > 0 ? homeStyles["product-card__status--in-stock"] : homeStyles["product-card__status--out-of-stock"]}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <Link href={`/products/${product.slug}`} className={styles["product-card-list__name"]}>
          {product.name}
        </Link>
        <p className={styles["product-card-list__desc"]}>
          {product.shortDescription || "No description available."}
        </p>
        <div className={styles["product-card-list__footer-row"]}>
          <div className={homeStyles["product-card__pricing"]}>
            <span className={homeStyles["product-card__price"]}>৳{price.toLocaleString("en-BD")}</span>
            {comparePrice && <span className={homeStyles["product-card__price-original"]}>৳{comparePrice.toLocaleString("en-BD")}</span>}
            {discount && <span className={homeStyles["product-card__price-discount"]}>{discount}</span>}
          </div>
          <button
            className="btn btn--primary btn--sm"
            onClick={async (e) => {
              e.preventDefault();
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
    </div>
  );
}

/* ── Filter Content ── */
interface FilterContentProps {
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (status: string) => void;
  priceMin: string;
  setPriceMin: (val: string) => void;
  priceMax: string;
  setPriceMax: (val: string) => void;
  allCategories: any[];
}

function FilterContent({
  selectedCategories, toggleCategory,
  availabilityFilter, setAvailabilityFilter,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
  allCategories
}: FilterContentProps) {
  return (
    <div className={styles["filters-content"]}>
      {/* Availability Filter */}
      <div className={styles["filter-group"]}>
        <div className={styles["filter-group__title"]}>Availability</div>
        <div className={styles["filter-group__options"]}>
          {["all", "in-stock", "out-of-stock"].map((opt) => (
            <label key={opt} className={styles["filter-option"]}>
              <input
                type="radio"
                checked={availabilityFilter === opt}
                onChange={() => setAvailabilityFilter(opt)}
                className={styles["filter-option__checkbox"]}
              />
              {opt === "all" ? "All" : opt === "in-stock" ? "In Stock" : "Out of Stock"}
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
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

      {/* Category Filter */}
      <div className={styles["filter-group"]}>
        <div className={styles["filter-group__title"]}>Category</div>
        <div className={styles["filter-group__options"]}>
          {allCategories.map((cat) => (
            <label key={cat.id} className={styles["filter-option"]}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className={styles["filter-option__checkbox"]}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BrandListingPage({ params }: PageProps) {
  const router = useRouter();
  const unpackedParams = use(params);
  const brandSlug = unpackedParams.slug;

  const [brandName, setBrandName] = useState(
    brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1).replace("-", " ")
  );

  // States
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Fetch Brand Info
  useEffect(() => {
    async function loadBrandInfo() {
      try {
        const res = await fetch("http://localhost:4000/api/products/brands").then((r) => r.json());
        if (res && res.brands) {
          const match = res.brands.find((b: any) => b.slug === brandSlug);
          if (match) setBrandName(match.name);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadBrandInfo();
  }, [brandSlug]);

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
        const catVal = selectedCategories.join(",") || undefined;

        const filters: any = {
          page: currentPage,
          limit: 12,
          sort: sortBy,
          brand: brandSlug,
          category: catVal,
          minPrice: priceMin ? Number(priceMin) : undefined,
          maxPrice: priceMax ? Number(priceMax) : undefined,
          inStock: availabilityFilter === "in-stock" ? true : availabilityFilter === "out-of-stock" ? false : undefined,
        };

        const res = await productApi.list(filters);
        if (res && res.products) {
          setProducts(res.products);
          setTotalPages(res.pagination.totalPages);
          setTotalProducts(res.pagination.total);
        }
      } catch (err) {
        console.error("Failed to fetch brand products", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [brandSlug, currentPage, sortBy, selectedCategories, availabilityFilter, priceMin, priceMax]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c: string) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const activeFilterCount = selectedCategories.length + (availabilityFilter !== "all" ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setAvailabilityFilter("all");
    setPriceMin("");
    setPriceMax("");
    setCurrentPage(1);
  };

  const filterProps = {
    selectedCategories, toggleCategory,
    availabilityFilter, setAvailabilityFilter,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    allCategories: categories,
  };

  return (
    <div className={`container ${styles["listing-page"]}`}>
      {/* Breadcrumbs */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">Home</Link>
        </li>
        <li className="breadcrumb__item">
          <Link href="/brands" className="breadcrumb__link">Brands</Link>
        </li>
        <li className="breadcrumb__item">
          <span className="breadcrumb__current">{brandName}</span>
        </li>
      </nav>

      {/* Page Header */}
      <div className={styles["listing-page__header"]}>
        <h1 className={styles["listing-page__title"]}>
          {brandName} Collection
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
        <aside className={`${styles["filter-sidebar"]} ${styles["filter-sidebar--visible"]}`} id="filter-sidebar">
          <FilterContent {...filterProps} />
        </aside>

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
