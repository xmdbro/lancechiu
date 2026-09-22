import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lance Chiu",
  description: "hi@lancechiu.com",
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
      <body>{children}</body>
    </html>
  );
}
