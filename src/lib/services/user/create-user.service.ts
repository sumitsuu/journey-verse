import "server-only";

import * as argon2 from "argon2";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { User } from "../../types/user";

export async function createUsers(data: { email: string; password: string; displayName: string }): Promise<User> {
  const passwordHash = await argon2.hash(data.password);
  const [created] = await db
    .insert(schema.users)
    .values({
      email: data.email,
      password: passwordHash,
      displayName: data.displayName,
    })
    .returning();

  const result: User = {
    id: created.id,
    email: created.email,
    displayName: created.displayName,
    avatarPath: created.avatarPath,
    favouredTypeId: created.favouredTypeId,
  };

  return result;
}
