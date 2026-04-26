import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { hasRole } from "../user/find-user-roles.service";

export async function authorizeAccess({ userId }: { userId: number }): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const sessionUserId = Number(session.user.id);
  if (sessionUserId !== userId && !(await hasRole(sessionUserId, "admin"))) {
    throw new Error("Unauthorized");
  }
}

export async function authorizeAdmin(): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session || !(await hasRole(Number(session.user.id), "admin"))) {
    throw new Error("Unauthorized");
  }
}

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !(await hasRole(Number(session.user.id), "admin"))) {
    throw new Error("Unauthorized");
  }
  return session;
}
