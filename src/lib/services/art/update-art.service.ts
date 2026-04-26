import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";

export const UpdateArtInputSchema = z.object({
  artId: z.number().int().positive(),
  title: z.string().optional(),
  description: z.string().optional(),
  previewPath: z.string().optional(),
  rating: z.union([z.number().min(0).max(10), z.null()]).optional(),
});
export type UpdateArtInput = z.infer<typeof UpdateArtInputSchema>;

export async function updateArt({ artId, title, description, previewPath, rating }: UpdateArtInput) {
  const artPatch: { previewPath?: string | null; rating?: string | null } = {};
  if (previewPath !== undefined) {
    artPatch.previewPath = previewPath;
  }
  if (rating !== undefined) {
    artPatch.rating = rating === null ? null : String(rating);
  }

  let art: typeof schema.arts.$inferSelect | undefined;
  if (Object.keys(artPatch).length > 0) {
    const [updated] = await db.update(schema.arts).set(artPatch).where(eq(schema.arts.id, artId)).returning();
    art = updated;
  }

  if (title || description) {
    await db.update(schema.artTranslations).set({ title, description }).where(eq(schema.artTranslations.artId, artId));
  }

  return art;
}
