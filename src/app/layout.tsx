import { Metadata } from "next";
import React from "react";

import "../global.css";

export const metadata: Metadata = {
  title: "Journey Verse",
  description: "Journey begins here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

