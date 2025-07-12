import "./globals.css";
import { Outfit } from "next/font/google";
import { Public_Sans } from "next/font/google";

// Load the Outfit font
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

// ✅ This metadata will be auto-injected into <head> by Next.js
export const metadata = {
  title: "Scale",
  description: "Manage your deals effortlessly.",
  icons: {
    icon: "/favicon.png",
  },
};

// Main layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
