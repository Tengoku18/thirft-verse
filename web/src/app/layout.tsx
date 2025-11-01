import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";
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
  title: "ThriftVerse",
  description: "Discover unique vintage and thrift finds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
