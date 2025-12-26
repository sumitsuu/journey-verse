import "server-only";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { Locale } from "../../i18n/locales";
import { uploadFile } from "../storage/minio-client.service";

export async function createArts(
  locale: Locale,
  previewFile: { buffer: Buffer; originalname: string },
  data: {
    releaseDate: Date;
    countryId: number;
    typeId: number;
    statusId: number;
    episodes: number;
    title: string;
    description: string;
    genres?: number[];
  }
) {
  const fileName = `arts/${Date.now()}-${previewFile.originalname}`;
  const uploadResult = await uploadFile(fileName, previewFile.buffer);

  if (!uploadResult.success) {
    throw new Error(uploadResult.error);
  }

  const [art] = await db
    .insert(schema.arts)
    .values({
      releaseDate: data.releaseDate,
      countryId: data.countryId,
      typeId: data.typeId,
      statusId: data.statusId,
      episodes: data.episodes,
      previewPath: uploadResult.key,
    })
    .returning();

  if (data.genres?.length) {
    // TODO: Handle genres if needed
  }

  await db.insert(schema.artTranslations).values({
    artId: art.id,
    locale,
    title: data.title,
    description: data.description,
  });

  return art;
}
