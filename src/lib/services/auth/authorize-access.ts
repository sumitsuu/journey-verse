import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { hasRole } from "../user/find-user-roles.service";

export async function authorizeAccess({ userId }: { userId: number }): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (session.user.id !== userId && !(await hasRole(session.user.id, "admin"))) {
    throw new Error("Unauthorized");
  }
}

export async function authorizeAdmin(): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session || !(await hasRole(session.user.id, "admin"))) {
    throw new Error("Unauthorized");
  }
}
