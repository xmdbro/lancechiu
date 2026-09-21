import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lance Chiu",
  description: "hi@lancechiu.com",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
