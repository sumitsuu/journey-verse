import { Toaster } from "@/components/ui/toaster";
import Providers from "@/src/app/providers";
import LayoutWrapper from "@/src/app/_components/layout-wrapper";
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root" className={"flex flex-col items-center mx-auto w-full h-screen"}>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Providers>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
