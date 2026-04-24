import "server-only";

import { and, eq } from "drizzle-orm";
import z from "zod";

import { db } from "../../db";
import * as schema from "../../db/schema";

export const UpsertLibraryStatusInputSchema = z.object({
  artId: z.number().int().positive(),
  userId: z.number().int().positive(),
  statusId: z.number().int().positive(),
});

export type UpsertLibraryStatusInput = z.infer<typeof UpsertLibraryStatusInputSchema>;
export type UpsertLibraryStatusOutput = typeof schema.library.$inferSelect;

export async function upsertLibraryStatus({
  artId,
  userId,
  statusId,
}: UpsertLibraryStatusInput): Promise<UpsertLibraryStatusOutput> {
  const [existingLibraryItem] = await db
    .select()
    .from(schema.library)
    .where(and(eq(schema.library.artId, artId), eq(schema.library.userId, userId)))
    .limit(1);

  if (existingLibraryItem) {
    const [updatedLibraryItem] = await db
      .update(schema.library)
      .set({
        statusId,
        updatedAt: new Date(),
      })
      .where(eq(schema.library.id, existingLibraryItem.id))
      .returning();

    return updatedLibraryItem;
  }

  const [createdLibraryItem] = await db
    .insert(schema.library)
    .values({
      artId,
      userId,
      statusId,
      episodes: 0,
    })
    .returning();

  return createdLibraryItem;
}
