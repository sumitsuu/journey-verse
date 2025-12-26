"use server";

import { z } from "zod";

import { createLibrary } from "../../services/library/create-library/create-library.service";

const createLibrarySchema = z.object({
  artId: z.number().int().positive(),
  userId: z.number().int().positive(),
  statusId: z.number().int().positive(),
  rating: z.number().min(0).max(10),
  episodes: z.number().int().min(0),
});

export async function createLibraryAction(data: z.infer<typeof createLibrarySchema>): Promise<void> {
  try {
    const validated = createLibrarySchema.parse(data);
    await createLibrary({
      artId: validated.artId,
      userId: validated.userId,
      statusId: validated.statusId,
      rating: validated.rating,
      episodes: validated.episodes,
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create library item");
  }
}
