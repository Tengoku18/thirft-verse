import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";
import Head from "next/head";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

const folito = localFont({
  src: [
    {
      path: "../../public/font/Folito-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/font/Folito-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/Folito-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/Folito-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/font/Folito-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-folito",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thriftverse.shop"),
  title: "ThriftVerse — Your Finds. Your Store. Your Story.",
  description: "Create your own thrift store and give every item a second life.",
  openGraph: {
    title: "ThriftVerse — Your Finds. Your Store. Your Story.",
    description: "Create your own thrift store and give every item a second life.",
    url: "https://www.thriftverse.shop",
    siteName: "ThriftVerse",
    images: [
      {
        url: "https://www.thriftverse.shop/images/og.png",
        width: 1200,
        height: 630,
        alt: "ThriftVerse — Reuse. Resell. Renew."
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ThriftVerse — Your Finds. Your Store. Your Story.",
    description: "Create your own thrift store and give every item a second life.",
    images: [
      {
        url: "https://www.thriftverse.shop/images/og.png",
        alt: "ThriftVerse — Reuse. Resell. Renew."
      }
    ]
  }
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {/* Explicit OG meta tags for scrapers */}
        <meta property="og:title" content="ThriftVerse — Your Finds. Your Store. Your Story." />
        <meta property="og:description" content="Create your own thrift store and give every item a second life." />
        <meta property="og:image" content="https://www.thriftverse.shop/images/og.png" />
        <meta property="og:url" content="https://www.thriftverse.shop" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ThriftVerse — Your Finds. Your Store. Your Story." />
        <meta name="twitter:description" content="Create your own thrift store and give every item a second life." />
        <meta name="twitter:image" content="https://www.thriftverse.shop/images/og.png" />
      </Head>
      <body
        className={`${nunitoSans.variable} ${folito.variable} antialiased`}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#3B2F2F',
              color: '#fff',
              borderRadius: '1rem',
            },
            success: {
              iconTheme: {
                primary: '#D4A373',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
