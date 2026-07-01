import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — Innoverse Technologies",
  description: "Manage products, orders, and customers for Innoverse Technologies",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
