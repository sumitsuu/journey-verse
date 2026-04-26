import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";

export type UserRoleName = (typeof schema.roles.$inferSelect)["name"];

export async function findUserRoles(userId: number): Promise<UserRoleName[]> {
  const rows = await db
    .select({
      name: schema.roles.name,
    })
    .from(schema.userRoles)
    .innerJoin(schema.roles, eq(schema.roles.id, schema.userRoles.roleId))
    .where(eq(schema.userRoles.userId, userId));

  return rows.map((role) => role.name);
}

export async function hasRole(userId: number, roleName: UserRoleName): Promise<boolean> {
  const [role] = await db
    .select({
      id: schema.roles.id,
    })
    .from(schema.userRoles)
    .innerJoin(schema.roles, eq(schema.roles.id, schema.userRoles.roleId))
    .where(and(eq(schema.userRoles.userId, userId), eq(schema.roles.name, roleName)))
    .limit(1);

  return Boolean(role);
}
