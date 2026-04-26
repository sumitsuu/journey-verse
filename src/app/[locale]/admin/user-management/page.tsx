import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import type { Locale } from "@/src/lib/i18n/locales";
import { findRoles } from "@/src/lib/services/role/find-roles.service";
import { findUsersPage } from "@/src/lib/services/user/find-users.service";
import { hasRole } from "@/src/lib/services/user/find-user-roles.service";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { UserManagementView } from "./_components/user-management-view";

const UserManagementPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) => {
  const session = await getServerSession(authOptions);
  if (!session || !(await hasRole(session.user.id, "admin"))) {
    notFound();
  }

  await params;
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const q = sp.q?.trim() || undefined;

  const [roleCatalog, usersPage] = await Promise.all([
    findRoles(),
    findUsersPage({ search: q, page, pageSize: 15 }),
  ]);

  return <UserManagementView initialSearch={q ?? ""} roleCatalog={roleCatalog} usersPage={usersPage} />;
};

export default UserManagementPage;
