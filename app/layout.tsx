import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { RideTypeStoreProvider } from './Providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blazecab - Affordable Cab Rental Services",
  description:
    "Book reliable cab rentals with Blazecab. Affordable taxi services, airport transfers, and city rides with professional drivers.",
  keywords: [
    "cab rental",
    "taxi service",
    "book cab online",
    "airport cab",
    "city taxi",
    "car hire",
    "Blazecab",
  ],
  authors: [{ name: "Blazecab" }],
  openGraph: {
    title: "Blazecab - Reliable Cab Rental Service",
    description:
      "Enjoy safe, comfortable, and affordable cab rentals with Blazecab. Book online for quick rides, airport transfers, and more.",
    url: "https://blazecab.com",
    siteName: "Blazecab",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blazecab - Cab Rentals Made Easy",
    description:
      "Book cabs online with Blazecab. Affordable, reliable, and always on time.",
    creator: "@blazecab",
  },
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://blazecab.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RideTypeStoreProvider>
          <Toaster position="top-center" />
          {children}
        </RideTypeStoreProvider>
      </body>
    </html>
  );
}
