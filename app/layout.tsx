import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { RideTypeStoreProvider } from "./Providers";
import WhatsAppButton from '@/app/_components/Whatsappbutton';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlazeCab – Affordable & Reliable Cab Services Across India",
  description:
    "BlazeCab offers affordable and reliable cab services across India. Book local or outstation taxis anytime with safe drivers and 24/7 support",
  metadataBase: new URL("https://blazecab.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoUrl = "https://blazecab.com/assets/blazecab_logo.jpg"; 

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "BlazeCab – Local & Outstation Taxi Service in India",
    url: "https://blazecab.com/",
    telephone: "+91-7703821374",
    description:
      "BlazeCab – Trusted Taxi Service Across India. Since 2017, BlazeCab has been a premier taxi service in Delhi NCR and across India, offering local city rides, outstation one-way trips, round trips, airport transfers, and chauffeur-driven car rentals. We ensure safe, reliable, and comfortable travel with professional drivers and clean AC vehicles.",
    image: logoUrl,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "A194 3rd Floor, A Block, Block F, Sudershan Park",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110015",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.663679",
      longitude: "77.134322",
    },
    openingHours: "Mo-Su 00:00-23:59",
    areaServed: "IN",
    sameAs: [
      "https://www.facebook.com/blazecab/",
      "https://twitter.com/BlazeCab/",
      "https://www.instagram.com/blazecabs/",
      "https://www.linkedin.com/company/blazecab/",
      "https://in.pinterest.com/blazecabcarrentals/",
      "https://www.youtube.com/c/blazecab",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "280",
    },
    department: {
      "@type": "TaxiService",
      name: "BlazeCab Taxi & Cab Booking Service",
      serviceType: [
        "Local City Rides",
        "Outstation One Way",
        "Round Trips",
        "Airport Transfers",
        "Full Day Rentals",
      ],
      areaServed: [
        "Delhi NCR",
        "Mumbai",
        "Bengaluru",
        "Noida",
        "Gurugram",
        "Chennai",
      ],
      availableVehicle: [
        "Sedan",
        "SUV",
        "Innova Crysta",
        "Tempo Traveller",
        "Urbania Traveller",
        "Ertiga",
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "In which cities are BlazeCab services available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BlazeCab operates pan-India, including Delhi, Gurugram, Noida, Mumbai, Bengaluru, and Chennai. We provide both local and outstation rides.",
        },
      },
      {
        "@type": "Question",
        name: "What types of services does BlazeCab offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BlazeCab provides airport transfers, one-way trips, round trips, local city cabs, and all-inclusive packages including driver allowance, tolls, and fuel.",
        },
      },
      {
        "@type": "Question",
        name: "Can I book a cab for a full day?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, BlazeCab offers daily rentals where you can hire a cab and driver for the entire day as per your schedule.",
        },
      },
      {
        "@type": "Question",
        name: "Are BlazeCab rides chauffeur-driven?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. All BlazeCab rides are chauffeur-driven with professional and experienced drivers ensuring safety and comfort.",
        },
      },
      {
        "@type": "Question",
        name: "How can I book or contact BlazeCab?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can book online at https://blazecab.com or contact our 24x7 support at +91-7703821374 for instant assistance.",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* ✅ Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5XH747PS');
          `}
        </Script>

        {/* ✅ JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5XH747PS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <RideTypeStoreProvider>
          <Toaster position="top-center" />
          {children}
          <WhatsAppButton/>
        </RideTypeStoreProvider>
      </body>
    </html>
  );
}
