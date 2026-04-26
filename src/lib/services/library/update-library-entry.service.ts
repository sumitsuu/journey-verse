import "server-only";

import { and, eq } from "drizzle-orm";
import z from "zod";

import { db } from "../../db";
import * as schema from "../../db/schema";
import { recalculateArtRating } from "../art/recalculate-art-rating.service";

export const UpdateLibraryEntryInputSchema = z.object({
  artId: z.number().int().positive(),
  userId: z.number().int().positive(),
  statusId: z.number().int().positive(),
  episodes: z.number().int().min(0),
  rating: z.number().min(0).max(10),
});

export type UpdateLibraryEntryInput = z.infer<typeof UpdateLibraryEntryInputSchema>;
export type UpdateLibraryEntryOutput = typeof schema.library.$inferSelect;

export async function updateLibraryEntry({
  artId,
  userId,
  statusId,
  episodes,
  rating,
}: UpdateLibraryEntryInput): Promise<UpdateLibraryEntryOutput> {
  const [existing] = await db
    .select()
    .from(schema.library)
    .where(and(eq(schema.library.artId, artId), eq(schema.library.userId, userId)))
    .limit(1);

  if (!existing) {
    throw new Error("Library entry not found");
  }

  const [updated] = await db
    .update(schema.library)
    .set({
      statusId,
      episodes,
      rating: String(rating),
      updatedAt: new Date(),
    })
    .where(eq(schema.library.id, existing.id))
    .returning();

  await recalculateArtRating(artId);

  return updated;
}
