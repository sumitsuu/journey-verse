import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";
import "../../global.css";
import { routing } from "../../i18n/routing";
import Providers from "../providers";
import LayoutWrapper from "./_components/layout-wrapper";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ru")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <div id="root" className={"flex flex-col items-center mx-auto w-full h-screen"}>
            <Providers>
              <LayoutWrapper>{children}</LayoutWrapper>
            </Providers>
          </div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
