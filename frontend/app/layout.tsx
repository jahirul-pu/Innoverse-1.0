import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthContextProvider } from "@/components/providers/AuthContext";
import { CartContextProvider } from "@/components/providers/CartContext";
import { ToastContextProvider } from "@/components/providers/ToastContext";
import { WishlistContextProvider } from "@/components/providers/WishlistContext";

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
        <ThemeProvider>
          <AuthContextProvider>
            <ToastContextProvider>
              <WishlistContextProvider>
                <CartContextProvider>
                  {children}
                </CartContextProvider>
              </WishlistContextProvider>
            </ToastContextProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
