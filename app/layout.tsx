import type { Metadata } from "next";
import {  Inter_Tight } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/theme-context";
import { ProviderProvider } from "./contexts/provider-context";

const inter = Inter_Tight({
  variable: "--font-inter",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Indura Provider",
  description: "Indura Provider",
  icons: {
    icon: "https://res.cloudinary.com/dcxdrsgjs/image/upload/v1762925839/Group_phh0r8.svg",
  },
  openGraph: {
    title: "Indura Provider",
    description: "Indura Provider",
    url: "https://www.indurahealth.com/",
    siteName: "Indura Provider",
    images: [
      { url: "https://www.indurahealth.com/og-image.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <ProviderProvider>
            {children}
          </ProviderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
