import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Innoverse Technologies — Gadgets & Electronics",
  description:
    "Bangladesh's trusted online store for gadgets, electronics, and tech accessories. Shop authentic products with Cash on Delivery and BanglaQR payment options.",
  keywords: [
    "electronics",
    "gadgets",
    "Bangladesh",
    "online store",
    "tech accessories",
    "earbuds",
    "smart home",
    "wearables",
  ],
  openGraph: {
    title: "Innoverse Technologies",
    description:
      "Shop authentic gadgets and electronics online in Bangladesh.",
    type: "website",
    locale: "en_BD",
    siteName: "Innoverse Technologies",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
