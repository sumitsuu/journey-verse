"use server";

import { eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { User } from "../../types/user";

export async function findUsersByEmail(email: string): Promise<User | null> {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));

  if (!user) {
    return null;
  }

  const result: User = {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarPath: user.avatarPath,
    favouredTypeId: user.favouredTypeId,
  };

  return result;
}

export async function findUsersById(id: number): Promise<User | null> {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));

  if (!user) {
    return null;
  }

  const result: User = {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarPath: user.avatarPath,
    favouredTypeId: user.favouredTypeId,
  };

  return result;
}
