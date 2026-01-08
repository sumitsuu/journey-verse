import "server-only";

import * as argon2 from "argon2";
import { eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";

export type LoginUserOutput = Omit<typeof schema.users.$inferSelect, "password">;

export async function loginUsers(data: { email: string; password: string }): Promise<LoginUserOutput> {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, data.email));

  if (!user) {
    throw new Error("No such user was found");
  }

  if (!(await argon2.verify(user.password, data.password))) {
    throw new Error("Password is incorrect");
  }

  const result: LoginUserOutput = {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarPath: user.avatarPath,
    favouredTypeId: user.favouredTypeId,
  };

  return result;
}
