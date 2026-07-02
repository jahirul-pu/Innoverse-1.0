"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Award, ShieldAlert } from "lucide-react";
import styles from "./BrandsPage.module.css";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/api/products/brands").then((r) => r.json());
        if (res && res.brands) {
          setBrands(res.brands);
        } else {
          throw new Error("Failed to load brands list");
        }
      } catch (err: any) {
        console.error(err);
        setError("Unable to load brands list. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`container ${styles["brands-page"]}`}>
      {/* Breadcrumbs */}
      <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: "var(--space-6)" }}>
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">Home</Link>
        </li>
        <li className="breadcrumb__item">
          <span className="breadcrumb__current">All Brands</span>
        </li>
      </nav>

      {/* Header section */}
      <div className={styles["brands-header"]}>
        <div className={styles["brands-header__content"]}>
          <div className={styles["brands-header__tag"]}>
            <Award size={16} /> Partnered Brands
          </div>
          <h1 className={styles["brands-header__title"]}>Browse by Brand</h1>
          <p className={styles["brands-header__desc"]}>
            Discover products from the world's leading electronics and gadget innovators.
          </p>
        </div>

        {/* Search */}
        <div className={styles["brands-search"]}>
          <Search className={styles["brands-search__icon"]} size={18} />
          <input
            type="text"
            className={styles["brands-search__input"]}
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "100px 0", color: "var(--color-text-tertiary)", fontFamily: "var(--font-data)" }}>
          Loading brand directory...
        </div>
      ) : error ? (
        <div className={styles["brands-error"]}>
          <ShieldAlert size={48} />
          <h3>{error}</h3>
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className={styles["brands-empty"]}>
          <h3>No brands match your search</h3>
          <p>Try a different keyword or search query.</p>
        </div>
      ) : (
        <div className={styles["brands-grid"]}>
          {filteredBrands.map((brand) => (
            <Link key={brand.id} href={`/brand/${brand.slug}`} className={styles["brand-card"]}>
              <div className={styles["brand-card__avatar"]}>
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className={styles["brand-card__logo-img"]} />
                ) : (
                  <span className={styles["brand-card__initial"]}>{brand.name.charAt(0)}</span>
                )}
              </div>
              <h3 className={styles["brand-card__name"]}>{brand.name}</h3>
              <p className={styles["brand-card__desc"]}>
                {brand.description || "Premium authentic electronics and high-performance accessories."}
              </p>
              <div className={styles["brand-card__cta"]}>View Products →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
