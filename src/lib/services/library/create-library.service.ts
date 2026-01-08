import "server-only";

import z from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";

export const CreateLibraryInputSchema = z.object({
  artId: z.number().int().positive(),
  userId: z.number().int().positive(),
  statusId: z.number().int().positive(),
  rating: z.number().min(0).max(10).optional(),
  episodes: z.number().int().min(0),
});

export type CreateLibraryInput = z.infer<typeof CreateLibraryInputSchema>;
export type CreateLibraryOutput = typeof schema.library.$inferSelect;

export async function createLibrary({
  artId,
  userId,
  statusId,
  rating,
  episodes,
}: CreateLibraryInput): Promise<CreateLibraryOutput> {
  const [library] = await db
    .insert(schema.library)
    .values({
      artId,
      userId,
      statusId,
      rating: rating !== undefined ? String(rating) : undefined,
      episodes,
    })
    .returning();
  return library;
}
