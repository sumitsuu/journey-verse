"use server";

import { eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { User } from "../../types";

export async function updateUsers(data: User): Promise<User> {
  const [existing] = await db.select().from(schema.users).where(eq(schema.users.id, data.id));

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
    .where(eq(schema.users.id, data.id))
    .returning();

  const result: User = {
    id: updated.id,
    email: updated.email,
    displayName: updated.displayName,
    avatarPath: updated.avatarPath,
    favouredTypeId: updated.favouredTypeId,
  };

  return result;
}
