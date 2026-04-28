import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "One Click Advertisement | Premium Outdoor Advertising in UAE",
  description: "High-impact outdoor advertising solutions across prime locations in the UAE. From billboards to vehicle branding, we make brands impossible to ignore.",
  keywords: ["outdoor advertising", "billboards UAE", "signage Dubai", "vehicle branding", "One Click Advertisement"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
