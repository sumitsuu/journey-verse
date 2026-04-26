import "server-only";

import { eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import { deleteFile } from "../storage/minio-client.service";

export async function deleteArt(artId: number): Promise<void> {
  const [art] = await db.select().from(schema.arts).where(eq(schema.arts.id, artId));

  if (!art) {
    throw new Error("Art not found");
  }

  await db.transaction(async (tx) => {
    await tx.delete(schema.library).where(eq(schema.library.artId, artId));
    await tx.delete(schema.artGenres).where(eq(schema.artGenres.artId, artId));
    await tx.delete(schema.artTranslations).where(eq(schema.artTranslations.artId, artId));
    await tx.delete(schema.arts).where(eq(schema.arts.id, artId));
  });

  if (art.previewPath) {
    await deleteFile(art.previewPath).catch((error) => {
      console.error("Failed to delete art preview file", error);
    });
  }
}
