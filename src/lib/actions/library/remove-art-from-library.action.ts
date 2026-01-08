"use server";

import { z } from "zod";

import { authorizeAccess } from "../../services/auth/authorize-access";
import { removeArtFromLibrary } from "../../services/library/remove-art-from-library.service";

const removeArtFromLibrarySchema = z.object({
  libraryId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export async function removeArtFromLibraryAction(data: z.infer<typeof removeArtFromLibrarySchema>): Promise<void> {
  try {
    const validated = removeArtFromLibrarySchema.parse(data);
    await authorizeAccess({ userId: data.userId });

    await removeArtFromLibrary({
      userId: validated.userId,
      libraryId: validated.libraryId,
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to remove art from library");
  }
}
