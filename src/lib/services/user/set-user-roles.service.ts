import "server-only";

import { eq } from "drizzle-orm";

import { z } from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { findUserRoles, type UserRoleName } from "./find-user-roles.service";

export const SetUserRolesSchema = z.object({
  userId: z.number().int().positive(),
  roleNames: z.array(z.string()),
});

export type SetUserRolesInput = z.infer<typeof SetUserRolesSchema>;

export type SetUserRolesOutput = {
  userId: number;
  roles: UserRoleName[];
};

export async function setUserRoles(input: SetUserRolesInput): Promise<SetUserRolesOutput> {
  const { userId, roleNames } = SetUserRolesSchema.parse(input);
  const uniqueNames = [...new Set(roleNames)] as UserRoleName[];

  const [target] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.id, userId));

  if (!target) {
    throw new Error("User not found");
  }

  const allRoles = await db.select({ id: schema.roles.id, name: schema.roles.name }).from(schema.roles);
  const roleByName = new Map(allRoles.map((r) => [r.name, r.id]));

  for (const name of uniqueNames) {
    if (!roleByName.has(name)) {
      throw new Error("Invalid role");
    }
  }

  const previousRoles = await findUserRoles(userId);
  const hadAdmin = previousRoles.includes("admin");
  const willHaveAdmin = uniqueNames.includes("admin");

  if (hadAdmin && !willHaveAdmin) {
    const adminRoleId = roleByName.get("admin");
    if (adminRoleId !== undefined) {
      const adminAssignments = await db
        .select({ userId: schema.userRoles.userId })
        .from(schema.userRoles)
        .where(eq(schema.userRoles.roleId, adminRoleId));
      const otherAdmins = adminAssignments.filter((row) => row.userId !== userId);
      if (otherAdmins.length === 0) {
        throw new Error("Cannot remove the last administrator");
      }
    }
  }

  await db.transaction(async (tx) => {
    await tx.delete(schema.userRoles).where(eq(schema.userRoles.userId, userId));
    if (uniqueNames.length === 0) {
      return;
    }
    const ids = uniqueNames.map((name) => roleByName.get(name)!);
    await tx.insert(schema.userRoles).values(ids.map((roleId) => ({ userId, roleId })));
  });

  return {
    userId,
    roles: await findUserRoles(userId),
  };
}
