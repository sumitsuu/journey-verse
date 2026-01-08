import "server-only";

import { eq } from "drizzle-orm";

import { z } from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";

export const UpdateUserSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  avatarPath: z.string().nullable(),
  favouredTypeId: z.number().nullable(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateUserOutput = Omit<typeof schema.users.$inferSelect, "password">;

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
  };

  return result;
}
