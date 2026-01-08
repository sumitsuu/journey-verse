import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function authorizeAccess({ userId }: { userId: number }): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  // TODO: add role check
  if (session.user.id !== userId) {
    throw new Error("Unauthorized");
  }
}
