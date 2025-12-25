import { redirect } from "@/src/i18n/routing";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";

const Layout = async ({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const session = await getServerSession();

  if (!session) {
    redirect({ href: "/sign-in", locale });
  }

  return <>{children}</>;
};
export default Layout;
