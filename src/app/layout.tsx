import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lumiorasoap.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "LUMIORA — Handcrafted Cold-Process Soap Atelier, Karachi",
    template: "%s | LUMIORA",
  },
  description:
    "Handmade cold-process soap in Karachi by LUMIORA. Handcrafted slowly with pure olive oil, virgin coconut oil, unrefined shea butter, and whole botanicals. 4 weeks cured. Cash on delivery all over Karachi.",
  keywords: [
    "lumiora",
    "lumiora soap",
    "lumiora handcrafted",
    "handmade soap karachi",
    "cold process soap pakistan",
    "organic soap karachi",
    "rice and niacinamide soap double power",
    "rice and turmeric soap",
    "coffee and cocoa soap",
    "kojic acid skin whitening soap",
    "pore tightening soap",
    "natural soap bars karachi",
    "chemical free skincare pakistan",
    "cash on delivery soap karachi",
    "cold process artisanal soaps",
  ],
  authors: [{ name: "LUMIORA", url: baseUrl }],
  creator: "LUMIORA",
  publisher: "LUMIORA",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LUMIORA — Handcrafted Cold-Process Soap Atelier, Karachi",
    description:
      "Pure oils, whole botanicals, four weeks on a curing rack in Karachi. Rice & Niacinamide (Double Power), Rice & Turmeric, Coffee & Cocoa, and Kojic Acid Skin Whitening bars.",
    url: baseUrl,
    siteName: "LUMIORA",
    images: [
      {
        url: "/images/hero-kraft-box.jpg",
        width: 800,
        height: 1000,
        alt: "LUMIORA Handcrafted Cold-Process Soaps in Kraft Packaging",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMIORA — Handcrafted Soap, Karachi",
    description:
      "Handmade cold-process soap made with pure oils and whole botanicals. Cured four weeks. Karachi.",
    images: ["/images/hero-kraft-box.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f8f4ed",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLdStore = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "LUMIORA",
    description:
      "Handcrafted cold-process soap atelier based in Karachi, Pakistan. Pure oils, whole botanicals, cured 4 weeks.",
    url: baseUrl,
    telephone: "+923222635439",
    priceRange: "Rs. 500 - Rs. 550",
    image: `${baseUrl}/images/hero-kraft-box.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sector 5A-2, North Karachi",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.9962,
      longitude: 67.0645,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "23:00",
    },
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash on Delivery, JazzCash, Easypaisa",
  };

  const jsonLdProducts = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "Rice & Niacinamide Soap (Double Power)",
          image: `${baseUrl}/images/lumiora-rice-niacinamide.jpg`,
          description:
            "Formulated with double power pure niacinamide (Vitamin B3) and organic rice milk extract. Pore tightening, dual skin control, strengthens skin barrier, deeply hydrates.",
          brand: { "@type": "Brand", name: "LUMIORA" },
          offers: {
            "@type": "Offer",
            price: "550",
            priceCurrency: "PKR",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            url: `${baseUrl}#shop`,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Rice & Turmeric Soap",
          image: `${baseUrl}/images/lumiora-rice-turmeric.jpg`,
          description:
            "Raw wild kasturi turmeric, fresh organic rice milk, kokum butter. Skin tightening and glowing soap, reduces pimple marks & acne, leaves skin soft and supple.",
          brand: { "@type": "Brand", name: "LUMIORA" },
          offers: {
            "@type": "Offer",
            price: "550",
            priceCurrency: "PKR",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            url: `${baseUrl}#shop`,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Product",
          name: "Coffee & Cocoa Soap",
          image: `${baseUrl}/images/lumiora-coffee-cocoa.jpg`,
          description:
            "Fresh ground Arabica coffee and pure raw cocoa butter. Skin glowing and nourishing soap, soft and smooth skin, gentle exfoliation.",
          brand: { "@type": "Brand", name: "LUMIORA" },
          offers: {
            "@type": "Offer",
            price: "500",
            priceCurrency: "PKR",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            url: `${baseUrl}#shop`,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Product",
          name: "Kojic Acid Skin Whitening Soap",
          image: `${baseUrl}/images/lumiora-kojic-acid.jpg`,
          description:
            "High-potency pure kojic acid and alpha arbutin. Reduces two-tone skin, reduces acne and pimple marks, removes dark spots, anti-aging benefits.",
          brand: { "@type": "Brand", name: "LUMIORA" },
          offers: {
            "@type": "Offer",
            price: "550",
            priceCurrency: "PKR",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            url: `${baseUrl}#shop`,
          },
        },
      },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Add bars to your bag, fill in your name and area, and tap 'Place order on WhatsApp'. We will confirm your address and dispatch within 24 hours.",
        },
      },
      {
        "@type": "Question",
        name: "What does delivery cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fixed Rs 200 anywhere in Karachi. Cash on delivery, JazzCash, or Easypaisa.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a bar last?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three to five weeks of daily use, if you keep it on a draining soap dish between washes.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use these on my face?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every bar is mild enough for face and body. For very sensitive or reactive skin, start with the Rice & Niacinamide bar or Rice & Turmeric bar.",
        },
      },
      {
        "@type": "Question",
        name: "Do you deliver outside Karachi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not yet. We are a small operation and want to get local delivery right first.",
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${publicSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdStore) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProducts) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
