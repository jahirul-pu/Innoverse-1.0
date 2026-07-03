"use client";

import { useState, useEffect, use } from "react";

interface OrderData {
  orderNumber: string;
  total: string | number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryZone: string;
  courierPartner: string | null;
  trackingNumber: string | null;
  address: {
    fullName: string;
    phone: string;
    district: string;
    address: string;
  };
  items: Array<{
    quantity: number;
    productName: string;
  }>;
}

export default function StickerPage({ params }: { params: Promise<{ orderNumber: string }> }) {
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
      const timer = setTimeout(() => window.print(), 600);
      return () => clearTimeout(timer);
    }
  }, [order, loading]);

  if (loading) {
    return (
      <div style={centerBox}>
        <style>{baseStyles}</style>
        <div style={spinner} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={centerBox}>
        <style>{baseStyles}</style>
        <p style={{ color: "#EF4444", fontWeight: 600 }}>{error || "Order not found"}</p>
      </div>
    );
  }

  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const isCOD = order.paymentMethod === "COD";
  const isPaid = order.paymentStatus === "PAID";
  const total = Number(order.total);
  const amountPaid = isPaid ? total : 0;
  const amountDue = total - amountPaid;

  return (
    <>
      <style>{baseStyles}</style>
      <div style={pageWrapper}>
        {/* Controls */}
        <div className="no-print" style={controlBar}>
          <button onClick={() => window.print()} style={printBtn}>🖨 Print Sticker</button>
          <button onClick={() => window.close()} style={closeBtn}>✕ Close</button>
        </div>

        {/* Sticker */}
        <div className="sticker" style={sticker}>
          {/* From */}
          <div style={fromSection}>
            <div style={fromLabel}>FROM</div>
            <div style={fromText}>
              <strong>Innoverse Technologies</strong> · Dhaka · +880 1XXX-XXXXXX
            </div>
          </div>

          {/* Divider */}
          <div style={dashedDivider} />

          {/* To */}
          <div style={toSection}>
            <div style={toLabel}>TO</div>
            <div style={toName}>{order.address.fullName}</div>
            <div style={toPhone}>{order.address.phone}</div>
            <div style={toAddress}>{order.address.address}</div>
            <div style={toDistrict}>{order.address.district}</div>
          </div>

          {/* Divider */}
          <div style={dashedDivider} />

          {/* Bottom row: Order info + Amounts + COD */}
          <div style={bottomRow}>
            <div style={orderInfo}>
              <div style={orderLabel}>ORDER</div>
              <div style={orderNum}>{order.orderNumber}</div>
              <div style={itemCount}>{totalItems} item{totalItems !== 1 ? "s" : ""}</div>
              <div style={{ marginTop: 6, fontSize: 11, color: "#374151", lineHeight: 1.6 }}>
                <div>Total: <strong>৳{Number(order.total).toLocaleString("en-BD")}</strong></div>
                <div style={{ color: "#059669" }}>Paid: <strong>৳{amountPaid.toLocaleString("en-BD")}</strong></div>
                <div style={{ color: amountDue > 0 ? "#DC2626" : "#059669", fontWeight: 700 }}>Due: ৳{amountDue.toLocaleString("en-BD")}</div>
              </div>
            </div>

            {isCOD && !isPaid ? (
              <div style={codBox}>
                <div style={codLabel}>COD</div>
                <div style={codAmount}>৳{amountDue.toLocaleString("en-BD")}</div>
                <div style={codNote}>Collect on delivery</div>
              </div>
            ) : (
              <div style={paidBox}>
                <div style={paidLabel}>PAID</div>
                <div style={paidSub}>{paymentLabel(order.paymentMethod)}</div>
              </div>
            )}
          </div>

          {/* Zone badge */}
          <div style={zoneStrip}>
            {order.deliveryZone === "dhaka" ? "📍 INSIDE DHAKA" : "🚚 OUTSIDE DHAKA"}
          </div>
        </div>
      </div>
    </>
  );
}

function paymentLabel(method: string) {
  const m: Record<string, string> = { COD: "COD", BANGLAQR: "BanglaQR", BKASH: "bKash", NAGAD: "Nagad" };
  return m[method] || method;
}

// ── Styles ──

const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  
  @media print {
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .no-print { display: none !important; }
    .sticker {
      margin: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      border: 2px solid #000 !important;
    }
    @page {
      size: 100mm 150mm;
      margin: 0;
    }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const pageWrapper: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  background: "#E5E7EB",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const controlBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: "14px",
  background: "#1F2937",
  width: "100%",
};

const printBtn: React.CSSProperties = {
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

// ── Sticker (4×6 inch / 100×150mm) ──
const sticker: React.CSSProperties = {
  width: "100mm",
  minHeight: "140mm",
  background: "#FFFFFF",
  border: "2px solid #111827",
  borderRadius: 8,
  margin: "32px auto",
  padding: "14px 16px",
  display: "flex",
  flexDirection: "column",
  fontFamily: "'Inter', sans-serif",
  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  boxSizing: "border-box",
};

const fromSection: React.CSSProperties = {
  marginBottom: 4,
};

const fromLabel: React.CSSProperties = {
  fontSize: 8,
  fontWeight: 800,
  color: "#9CA3AF",
  letterSpacing: "0.12em",
  marginBottom: 2,
};

const fromText: React.CSSProperties = {
  fontSize: 10,
  color: "#4B5563",
  lineHeight: 1.4,
};

const dashedDivider: React.CSSProperties = {
  borderTop: "1.5px dashed #D1D5DB",
  margin: "10px 0",
};

const toSection: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
};

const toLabel: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 800,
  color: "#FF5A1F",
  letterSpacing: "0.12em",
  marginBottom: 6,
};

const toName: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#111827",
  lineHeight: 1.2,
  marginBottom: 4,
};

const toPhone: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "#111827",
  letterSpacing: "0.03em",
  marginBottom: 8,
  fontFamily: "'Inter', monospace",
};

const toAddress: React.CSSProperties = {
  fontSize: 12,
  color: "#374151",
  lineHeight: 1.5,
  marginBottom: 2,
};

const toDistrict: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#111827",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const bottomRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};

const orderInfo: React.CSSProperties = {
  flex: "1 1 auto",
};

const orderLabel: React.CSSProperties = {
  fontSize: 8,
  fontWeight: 800,
  color: "#9CA3AF",
  letterSpacing: "0.12em",
  marginBottom: 2,
};

const orderNum: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#111827",
  fontFamily: "'Inter', monospace",
};

const itemCount: React.CSSProperties = {
  fontSize: 10,
  color: "#6B7280",
  marginTop: 2,
};

const codBox: React.CSSProperties = {
  background: "#FEF2F2",
  border: "2px solid #EF4444",
  borderRadius: 8,
  padding: "8px 14px",
  textAlign: "center",
  minWidth: 100,
};

const codLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  color: "#DC2626",
  letterSpacing: "0.1em",
};

const codAmount: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 900,
  color: "#DC2626",
  fontFamily: "'Inter', monospace",
  lineHeight: 1.2,
};

const codNote: React.CSSProperties = {
  fontSize: 7,
  color: "#EF4444",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const paidBox: React.CSSProperties = {
  background: "#F0FDF4",
  border: "2px solid #22C55E",
  borderRadius: 8,
  padding: "8px 14px",
  textAlign: "center",
  minWidth: 80,
};

const paidLabel: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 900,
  color: "#16A34A",
  letterSpacing: "0.1em",
};

const paidSub: React.CSSProperties = {
  fontSize: 9,
  color: "#22C55E",
  fontWeight: 600,
};

const zoneStrip: React.CSSProperties = {
  marginTop: 10,
  padding: "6px 0",
  textAlign: "center",
  fontSize: 11,
  fontWeight: 800,
  color: "#1F2937",
  background: "#F3F4F6",
  borderRadius: 6,
  letterSpacing: "0.08em",
  border: "1px solid #E5E7EB",
};

const centerBox: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "#F3F4F6",
  fontFamily: "'Inter', sans-serif",
};

const spinner: React.CSSProperties = {
  width: 36,
  height: 36,
  border: "3px solid #E5E7EB",
  borderTopColor: "#FF5A1F",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};
