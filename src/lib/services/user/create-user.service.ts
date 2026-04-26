import "server-only";

import * as argon2 from "argon2";
import { eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import { findUserRoles, type UserRoleName } from "./find-user-roles.service";

export type CreateUserOutput = Omit<typeof schema.users.$inferSelect, "password"> & {
  roles: UserRoleName[];
};

export async function createUsers(data: {
  email: string;
  password: string;
  displayName: string;
}): Promise<CreateUserOutput> {
  const passwordHash = await argon2.hash(data.password);
  const [created] = await db
    .insert(schema.users)
    .values({
      email: data.email,
      password: passwordHash,
      displayName: data.displayName,
    })
    .returning();

  const [defaultRole] = await db.select().from(schema.roles).where(eq(schema.roles.name, "user"));

  if (defaultRole) {
    await db.insert(schema.userRoles).values({
      userId: created.id,
      roleId: defaultRole.id,
    });
  }

  const result: CreateUserOutput = {
    id: created.id,
    email: created.email,
    displayName: created.displayName,
    avatarPath: created.avatarPath,
    favouredTypeId: created.favouredTypeId,
    roles: await findUserRoles(created.id),
  };

  return result;
}
