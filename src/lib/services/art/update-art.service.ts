import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";

export const UpdateArtInputSchema = z.object({
  artId: z.number().int().positive(),
  title: z.string().optional(),
  description: z.string().optional(),
  previewPath: z.string().optional(),
  rating: z.number().min(0).max(10).optional(),
});
export type UpdateArtInput = z.infer<typeof UpdateArtInputSchema>;

export async function updateArt({ artId, title, description, previewPath, rating }: UpdateArtInput) {
  const [art] = await db
    .update(schema.arts)
    .set({ previewPath, rating: rating !== undefined ? String(rating) : undefined })
    .where(eq(schema.arts.id, artId))
    .returning();

  if (title || description) {
    await db.update(schema.artTranslations).set({ title, description }).where(eq(schema.artTranslations.artId, artId));
  }

  return art;
}
