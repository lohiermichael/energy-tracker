import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Energy Tracker",
  description: "Track your daily energy consumption and stay within limits",
  openGraph: {
    title: "Energy Tracker",
    description: "Track your daily energy consumption and stay within limits",
    type: "website",
    images: "/opengraph-image.png"
  },
  twitter: {
    card: "summary_large_image",
    title: "Energy Tracker",
    description: "Track your daily energy consumption and stay within limits",
    images: "/opengraph-image.png"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
