import "server-only";

import { eq } from "drizzle-orm";

import { z } from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { findUserRoles, type UserRoleName } from "./find-user-roles.service";

export const UpdateUserSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  avatarPath: z.string().nullable(),
  favouredTypeId: z.number().nullable(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateUserOutput = Omit<typeof schema.users.$inferSelect, "password"> & {
  roles: UserRoleName[];
};

export async function updateUsers({ id, ...data }: UpdateUserInput): Promise<UpdateUserOutput> {
  const [existing] = await db.select().from(schema.users).where(eq(schema.users.id, id));

  if (!existing) {
    throw new Error("User not found");
  }

  const [updated] = await db
    .update(schema.users)
    .set({
      email: data.email,
      displayName: data.displayName,
      avatarPath: data.avatarPath,
      favouredTypeId: data.favouredTypeId,
    })
    .where(eq(schema.users.id, id))
    .returning();

  const result: UpdateUserOutput = {
    id: updated.id,
    email: updated.email,
    displayName: updated.displayName,
    avatarPath: updated.avatarPath,
    favouredTypeId: updated.favouredTypeId,
    roles: await findUserRoles(updated.id),
  };

  return result;
}

export async function patchUser(
  id: number,
  data: Partial<Pick<UpdateUserInput, "email" | "displayName" | "avatarPath" | "favouredTypeId">>
): Promise<UpdateUserOutput> {
  const [existing] = await db.select().from(schema.users).where(eq(schema.users.id, id));

  if (!existing) {
    throw new Error("User not found");
  }

  const patch: Partial<typeof schema.users.$inferInsert> = {};
  if (data.email !== undefined) {
    patch.email = data.email;
  }
  if (data.displayName !== undefined) {
    patch.displayName = data.displayName;
  }
  if (data.avatarPath !== undefined) {
    patch.avatarPath = data.avatarPath;
  }
  if (data.favouredTypeId !== undefined) {
    patch.favouredTypeId = data.favouredTypeId;
  }

  if (Object.keys(patch).length === 0) {
    return {
      id: existing.id,
      email: existing.email,
      displayName: existing.displayName,
      avatarPath: existing.avatarPath,
      favouredTypeId: existing.favouredTypeId,
      roles: await findUserRoles(existing.id),
    };
  }

  const [updated] = await db
    .update(schema.users)
    .set(patch)
    .where(eq(schema.users.id, id))
    .returning({
      id: schema.users.id,
      email: schema.users.email,
      displayName: schema.users.displayName,
      avatarPath: schema.users.avatarPath,
      favouredTypeId: schema.users.favouredTypeId,
    });

  return {
    ...updated,
    roles: await findUserRoles(updated.id),
  };
}
