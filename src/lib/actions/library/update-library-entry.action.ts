"use server";

import { z } from "zod";

import { authorizeAccess } from "../../services/auth/authorize-access";
import { updateLibraryEntry } from "../../services/library/update-library-entry.service";

const updateLibraryEntrySchema = z.object({
  artId: z.number().int().positive(),
  userId: z.number().int().positive(),
  statusId: z.number().int().positive(),
  episodes: z.number().int().min(0),
  rating: z.number().min(0).max(10),
});

export async function updateLibraryEntryAction(data: z.infer<typeof updateLibraryEntrySchema>): Promise<void> {
  try {
    const validated = updateLibraryEntrySchema.parse(data);
    await authorizeAccess({ userId: validated.userId });

    await updateLibraryEntry({
      artId: validated.artId,
      userId: validated.userId,
      statusId: validated.statusId,
      episodes: validated.episodes,
      rating: validated.rating,
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update library entry");
  }
}
