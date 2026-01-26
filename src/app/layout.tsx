import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soham Shirke | Portfolio",
  description: "Passionate Computer Engineering student building applications and exploring new technologies.",
  metadataBase: new URL("https://portfolio-amber-eight-fyyg8bztpn.vercel.app"),

  openGraph: {
    title: "Soham Shirke | Portfolio",
    description: "Passionate Computer Engineering student building applications and exploring new technologies.",
    images: ["/cover.png"],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Soham Shirke | Portfolio",
    description: "Passionate Computer Engineering student building scalable applications and exploring new technologies.",
    images: ["/cover.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
