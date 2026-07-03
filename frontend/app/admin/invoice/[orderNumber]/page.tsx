"use client";

import { useState, useEffect, use } from "react";

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string | number;
  shippingCost: string | number;
  discount: string | number;
  total: string | number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryZone: string;
  estimatedDelivery: string | null;
  trackingNumber: string | null;
  courierPartner: string | null;
  notes: string | null;
  createdAt: string;
  user: {
    name: string | null;
    phone: string;
  };
  address: {
    fullName: string;
    phone: string;
    district: string;
    address: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: string | number;
    total: string | number;
    variantName: string | null;
    productName: string;
  }>;
}

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InvoicePage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`http://localhost:4000/api/orders/${orderNumber}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderNumber]);

  useEffect(() => {
    if (order && !loading) {
      const timer = setTimeout(() => {
        window.print();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [order, loading]);

  if (loading) {
    return (
      <div style={loadingStyles}>
        <div style={spinnerStyles} />
        <p style={{ marginTop: 16, color: "#6B7280", fontSize: 14 }}>Loading invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={loadingStyles}>
        <p style={{ color: "#EF4444", fontSize: 16, fontWeight: 600 }}>Error</p>
        <p style={{ color: "#6B7280", marginTop: 8 }}>{error || "Order not found"}</p>
      </div>
    );
  }

  const subtotal = Number(order.subtotal);
  const shipping = Number(order.shippingCost);
  const discount = Number(order.discount);
  const total = Number(order.total);
  const amountPaid = order.paymentStatus === "PAID" ? total : 0;
  const amountDue = total - amountPaid;

  return (
    <>
      <style>{printStyles}</style>
      <div style={pageWrapper}>
        {/* Print Controls — hidden when printing */}
        <div className="no-print" style={controlBar}>
          <button onClick={() => window.print()} style={printBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Invoice
          </button>
          <button onClick={() => window.close()} style={closeBtn}>
            ✕ Close
          </button>
        </div>

        {/* Invoice Container */}
        <div className="invoice-container" style={invoiceContainer}>
          {/* ── Header ── */}
          <div style={headerSection}>
            <div style={companyBlock}>
              <div style={logoRow}>
                <img
                  src="/logo.jpg"
                  alt="Innoverse Technologies"
                  style={logoImg}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div>
                  <h1 style={companyName}>Innoverse Technologies</h1>
                  <p style={companyTagline}>Premium Tech, Delivered</p>
                </div>
              </div>
              <div style={companyDetails}>
                <p>Dhaka, Bangladesh</p>
                <p>support@innoversetech.com | +880 1XXX-XXXXXX</p>
              </div>
            </div>
            <div style={invoiceMeta}>
              <h2 style={invoiceTitle}>INVOICE</h2>
              <table style={metaTable}>
                <tbody>
                  <tr>
                    <td style={metaLabel}>Invoice No:</td>
                    <td style={metaValue}>{order.orderNumber}</td>
                  </tr>
                  <tr>
                    <td style={metaLabel}>Date:</td>
                    <td style={metaValue}>{formatDate(order.createdAt)}</td>
                  </tr>
                  <tr>
                    <td style={metaLabel}>Payment:</td>
                    <td style={metaValue}>{paymentMethodLabel(order.paymentMethod)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={divider} />

          {/* ── Billing / Shipping ── */}
          <div style={addressRow}>
            <div style={addressBlock}>
              <h3 style={addressTitle}>Bill To</h3>
              <p style={addressName}>{order.user?.name || order.address.fullName}</p>
              <p style={addressDetail}>{order.address.phone}</p>
              <p style={addressDetail}>{order.address.address}, {order.address.district}</p>
            </div>
            <div style={addressBlock}>
              <h3 style={addressTitle}>Ship To</h3>
              <p style={addressName}>{order.address.fullName}</p>
              <p style={addressDetail}>{order.address.phone}</p>
              <p style={addressDetail}>{order.address.address}, {order.address.district}</p>
            </div>
            <div style={addressBlock}>
              <h3 style={addressTitle}>Delivery</h3>
              <p style={addressDetail}><strong>Zone:</strong> {order.deliveryZone === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</p>
              {order.estimatedDelivery && (
                <p style={addressDetail}><strong>Est.:</strong> {order.estimatedDelivery}</p>
              )}
              {order.trackingNumber && (
                <p style={addressDetail}><strong>Tracking:</strong> {order.trackingNumber}</p>
              )}
              {order.courierPartner && (
                <p style={addressDetail}><strong>Courier:</strong> {order.courierPartner}</p>
              )}
            </div>
          </div>

          {/* ── Items Table ── */}
          <table style={itemsTable}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "5%" }}>#</th>
                <th style={{ ...thStyle, width: "47%", textAlign: "left" }}>Item Description</th>
                <th style={{ ...thStyle, width: "13%", textAlign: "center" }}>Qty</th>
                <th style={{ ...thStyle, width: "15%", textAlign: "right" }}>Unit Price</th>
                <th style={{ ...thStyle, width: "20%", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={item.id} style={idx % 2 === 0 ? trEven : trOdd}>
                  <td style={{ ...tdStyle, textAlign: "center", color: "#9CA3AF" }}>{idx + 1}</td>
                  <td style={{ ...tdStyle, textAlign: "left" }}>
                    <span style={{ fontWeight: 600, color: "#111827" }}>{item.productName}</span>
                    {item.variantName && (
                      <span style={{ fontSize: 11, color: "#6B7280", marginLeft: 6 }}>
                        ({item.variantName})
                      </span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ ...tdStyle, textAlign: "right", fontFamily: "'Inter', monospace" }}>{formatBDT(Number(item.unitPrice))}</td>
                  <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, fontFamily: "'Inter', monospace" }}>{formatBDT(Number(item.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Totals ── */}
          <div style={totalsSection}>
            {order.notes && (
              <div style={notesBlock}>
                <h4 style={notesTitle}>Notes</h4>
                <p style={notesText}>{order.notes}</p>
              </div>
            )}
            <div style={totalsTable}>
              <div style={totalRow}>
                <span style={totalLabel}>Subtotal</span>
                <span style={totalValue}>{formatBDT(subtotal)}</span>
              </div>
              <div style={totalRow}>
                <span style={totalLabel}>Shipping</span>
                <span style={totalValue}>{formatBDT(shipping)}</span>
              </div>
              {discount > 0 && (
                <div style={totalRow}>
                  <span style={{ ...totalLabel, color: "#059669" }}>Discount</span>
                  <span style={{ ...totalValue, color: "#059669" }}>-{formatBDT(discount)}</span>
                </div>
              )}
              <div style={grandTotalDivider} />
              <div style={{ ...totalRow, paddingTop: 8, paddingBottom: 8 }}>
                <span style={grandTotalLabel}>Grand Total</span>
                <span style={grandTotalValue}>{formatBDT(total)}</span>
              </div>
              <div style={paymentDivider} />
              <div style={totalRow}>
                <span style={{ ...totalLabel, color: "#059669", fontWeight: 600 }}>Amount Paid</span>
                <span style={{ ...totalValue, color: "#059669", fontWeight: 600 }}>{formatBDT(amountPaid)}</span>
              </div>
              <div style={totalRow}>
                <span style={{ ...totalLabel, color: amountDue > 0 ? "#DC2626" : "#059669", fontWeight: 700 }}>Amount Due</span>
                <span style={{ ...totalValue, color: amountDue > 0 ? "#DC2626" : "#059669", fontWeight: 700, fontSize: 16 }}>{formatBDT(amountDue)}</span>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={footerDivider} />
          <div style={footerSection}>
            <p style={footerText}>Thank you for shopping with Innoverse Technologies!</p>
            <p style={footerSubtext}>support@innoversetech.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Payment Method Labels ──
function paymentMethodLabel(method: string) {
  const labels: Record<string, string> = {
    COD: "Cash on Delivery",
    BANGLAQR: "BanglaQR",
    BKASH: "bKash",
    NAGAD: "Nagad",
  };
  return labels[method] || method;
}

// ── Print Styles ──
const printStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  @media print {
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      background: #fff !important;
    }
    .no-print { display: none !important; }
    .invoice-container {
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }
    @page {
      size: A4;
      margin: 12mm 14mm;
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// ── Inline Styles (compact for single-page fit) ──
const pageWrapper: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  background: "#F3F4F6",
  minHeight: "100vh",
  padding: 0,
};

const controlBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  padding: "14px 24px",
  background: "#1F2937",
  position: "sticky",
  top: 0,
  zIndex: 50,
};

const printBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 22px",
  background: "#FF5A1F",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
};

const closeBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 18px",
  background: "transparent",
  color: "#9CA3AF",
  border: "1px solid #4B5563",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
};

const invoiceContainer: React.CSSProperties = {
  maxWidth: 780,
  margin: "24px auto",
  background: "#FFFFFF",
  borderRadius: 10,
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  padding: "32px 36px",
  border: "1px solid #E5E7EB",
};

// ── Header ──
const headerSection: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 20,
};

const companyBlock: React.CSSProperties = {
  flex: "1 1 auto",
};

const logoRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 6,
};

const logoImg: React.CSSProperties = {
  height: 40,
  width: "auto",
  borderRadius: 6,
  border: "1px solid #E5E7EB",
};

const companyName: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#111827",
  margin: 0,
  letterSpacing: "-0.02em",
};

const companyTagline: React.CSSProperties = {
  fontSize: 10,
  color: "#9CA3AF",
  margin: "1px 0 0",
  fontWeight: 500,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const companyDetails: React.CSSProperties = {
  fontSize: 11,
  color: "#6B7280",
  lineHeight: 1.6,
  marginTop: 2,
};

const invoiceMeta: React.CSSProperties = {
  textAlign: "right",
  flex: "0 0 auto",
};

const invoiceTitle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 800,
  color: "#FF5A1F",
  margin: "0 0 10px",
  letterSpacing: "0.08em",
};

const metaTable: React.CSSProperties = {
  borderCollapse: "collapse",
  marginLeft: "auto",
};

const metaLabel: React.CSSProperties = {
  fontSize: 11,
  color: "#9CA3AF",
  fontWeight: 500,
  paddingRight: 14,
  paddingBottom: 4,
  textAlign: "left",
  whiteSpace: "nowrap",
};

const metaValue: React.CSSProperties = {
  fontSize: 11,
  color: "#111827",
  fontWeight: 600,
  paddingBottom: 4,
  textAlign: "right",
  fontFamily: "'Inter', monospace",
};

// ── Divider ──
const divider: React.CSSProperties = {
  height: 1,
  background: "linear-gradient(90deg, transparent, #E5E7EB 15%, #E5E7EB 85%, transparent)",
  margin: "16px 0",
};

// ── Address Section ──
const addressRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 16,
  marginBottom: 18,
};

const addressBlock: React.CSSProperties = {
  padding: "10px 14px",
  background: "#F9FAFB",
  borderRadius: 8,
  border: "1px solid #F3F4F6",
};

const addressTitle: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#FF5A1F",
  margin: "0 0 6px",
};

const addressName: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#111827",
  margin: "0 0 2px",
};

const addressDetail: React.CSSProperties = {
  fontSize: 11,
  color: "#6B7280",
  margin: "2px 0",
  lineHeight: 1.4,
};

// ── Items Table ──
const itemsTable: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: 0,
};

const thStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#FFFFFF",
  background: "#1F2937",
  textAlign: "center",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 12,
  color: "#374151",
  borderBottom: "1px solid #F3F4F6",
};

const trEven: React.CSSProperties = {
  background: "#FFFFFF",
};

const trOdd: React.CSSProperties = {
  background: "#FAFAFA",
};

// ── Totals Section ──
const totalsSection: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 24,
  marginTop: 16,
  flexWrap: "wrap",
};

const notesBlock: React.CSSProperties = {
  flex: "1 1 200px",
  padding: "10px 14px",
  background: "#FFFBEB",
  borderRadius: 8,
  border: "1px solid #FDE68A",
};

const notesTitle: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#92400E",
  margin: "0 0 4px",
};

const notesText: React.CSSProperties = {
  fontSize: 11,
  color: "#78350F",
  lineHeight: 1.5,
  margin: 0,
};

const totalsTable: React.CSSProperties = {
  flex: "0 0 280px",
  marginLeft: "auto",
};

const totalRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "4px 0",
};

const totalLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#6B7280",
  fontWeight: 500,
};

const totalValue: React.CSSProperties = {
  fontSize: 12,
  color: "#111827",
  fontWeight: 600,
  fontFamily: "'Inter', monospace",
};

const grandTotalDivider: React.CSSProperties = {
  height: 2,
  background: "#1F2937",
  margin: "6px 0",
};

const grandTotalLabel: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#111827",
};

const grandTotalValue: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#111827",
  fontFamily: "'Inter', monospace",
};

const paymentDivider: React.CSSProperties = {
  height: 1,
  background: "#E5E7EB",
  margin: "6px 0",
};

// ── Footer ──
const footerDivider: React.CSSProperties = {
  height: 1,
  background: "linear-gradient(90deg, transparent, #E5E7EB 15%, #E5E7EB 85%, transparent)",
  margin: "20px 0 12px",
};

const footerSection: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
};

const footerText: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  margin: 0,
};

const footerSubtext: React.CSSProperties = {
  fontSize: 11,
  color: "#9CA3AF",
  margin: 0,
};

// ── Loading State ──
const loadingStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "#F3F4F6",
  fontFamily: "'Inter', system-ui, sans-serif",
};

const spinnerStyles: React.CSSProperties = {
  width: 40,
  height: 40,
  border: "3px solid #E5E7EB",
  borderTopColor: "#FF5A1F",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};
