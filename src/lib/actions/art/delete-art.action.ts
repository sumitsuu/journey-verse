"use server";

import { z } from "zod";

import { deleteArt } from "../../services/art/delete-art.service";
import { authorizeAdmin } from "../../services/auth/authorize-access";

const deleteArtSchema = z.object({
  artId: z.number().int().positive(),
});

export async function deleteArtAction(data: z.infer<typeof deleteArtSchema>): Promise<void> {
  try {
    await authorizeAdmin();

    const validated = deleteArtSchema.parse(data);
    await deleteArt(validated.artId);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete art");
  }
}
