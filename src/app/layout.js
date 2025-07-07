// // import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { Outfit } from "next/font/google";
// import { Metadata } from "next";

// // const geistSans = Geist({
// //   variable: "--font-geist-sans",
// //   subsets: ["latin"],
// // });

// // const geistMono = Geist_Mono({
// //   variable: "--font-geist-mono",
// //   subsets: ["latin"],
// // });

// const outfit = Outfit({
//   variable: "--font-outfit",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Scale",
//   description: "",
//   icons: {
//     icon: "/favicon.png", // Path to your favicon in /public
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="icon" href="/favicon.png" />
//         <title>Scale</title>
//       </head>
//       <body className={`${outfit.variable} antialiased`}>{children}</body>
//     </html>
//   );
// }









import "./globals.css";
import { Outfit } from "next/font/google";

// Load the Outfit font
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
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
