import { Link } from "@/src/i18n/routing";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

const AdminLayout = async ({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.layout" });

  return (
    <div className="min-h-screen w-full border-l-4 border-primary/40 bg-background">
      <div className="border-b border-border/80 bg-card/30">
        <div className="container mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <LayoutDashboard className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("kicker")}</p>
              <p className="text-sm font-semibold text-foreground">{t("title")}</p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("backToSite")}
          </Link>
        </div>
      </div>
      <div className="container mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
