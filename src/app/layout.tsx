import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Journey Verse",
  description: "Journey begins here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
