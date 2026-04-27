import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";
import { routing } from "../../i18n/routing";
import Providers from "../providers";
import LayoutWrapper from "./_components/layout-wrapper";
import { SetHtmlLang } from "./_components/set-html-lang";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const LocaleLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) => {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ru")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SetHtmlLang />
      <div id="root" className={"flex flex-col items-center mx-auto w-full h-screen"}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </div>
      <Toaster />
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
