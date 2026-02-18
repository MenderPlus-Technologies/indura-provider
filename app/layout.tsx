import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/theme-context";
import { ProviderProvider } from "./contexts/provider-context";
import { AuthProvider } from "./contexts/auth-context";
import { ReduxProvider } from "./store/provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body>
        <ReduxProvider>
          <ThemeProvider>
            <AuthProvider>
              <ProviderProvider>
                {children}
              </ProviderProvider>
            </AuthProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
