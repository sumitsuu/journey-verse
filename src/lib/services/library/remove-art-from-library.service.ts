import "server-only";

import { and, eq } from "drizzle-orm";
import z from "zod";

import { db } from "../../db";
import * as schema from "../../db/schema";
import { recalculateArtRating } from "../art/recalculate-art-rating.service";

export const RemoveArtFromLibraryInputSchema = z.object({
  userId: z.number().int().positive(),
  libraryId: z.number().int().positive(),
});

export type RemoveArtFromLibraryInput = z.infer<typeof RemoveArtFromLibraryInputSchema>;

export async function removeArtFromLibrary({ userId, libraryId }: RemoveArtFromLibraryInput): Promise<void> {
  const [{ deletedArtId }] = await db
    .delete(schema.library)
    .where(and(eq(schema.library.id, libraryId), eq(schema.library.userId, userId)))
    .returning({ deletedArtId: schema.library.artId });

  await recalculateArtRating(deletedArtId);
}
