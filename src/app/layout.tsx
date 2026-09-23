import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lancechiu.com"),
  title: "Lance Chiu",
  description: "Portfolio, projects, and writing by Lance Chiu.",
  openGraph: {
    title: "Lance Chiu",
    description: "Portfolio, projects, and writing by Lance Chiu.",
    siteName: "Lance Chiu",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lance Chiu",
    description: "Portfolio, projects, and writing by Lance Chiu.",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
