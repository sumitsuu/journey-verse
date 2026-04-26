import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { Link } from "@/src/i18n/routing";
import type { Locale } from "@/src/lib/i18n/locales";
import { hasRole } from "@/src/lib/services/user/find-user-roles.service";
import { Clapperboard, UsersRound } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

const AdminHomePage = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const session = await getServerSession(authOptions);
  if (!session || !(await hasRole(session.user.id, "admin"))) {
    notFound();
  }

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin.home" });

  const cards = [
    {
      href: "/admin/create-art",
      title: t("createArt.title"),
      description: t("createArt.description"),
      icon: Clapperboard,
    },
    {
      href: "/admin/user-management",
      title: t("userManagement.title"),
      description: t("userManagement.description"),
      icon: UsersRound,
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{t("heading")}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t("subheading")}</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ href, title, description, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex h-full gap-4 rounded-xl border border-border/80 bg-card/40 p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-card/70"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                <Icon className="size-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-white group-hover:text-primary">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHomePage;
