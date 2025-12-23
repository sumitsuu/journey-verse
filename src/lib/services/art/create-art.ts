"use server";

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { Locale } from "../../i18n/locales";

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
  // Upload file
  const uploadDir = join(process.cwd(), "public", "arts");
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${previewFile.originalname}`;
  const filePath = join(uploadDir, fileName);

  await writeFile(filePath, previewFile.buffer);

  const [art] = await db
    .insert(schema.arts)
    .values({
      releaseDate: data.releaseDate,
      countryId: data.countryId,
      typeId: data.typeId,
      statusId: data.statusId,
      episodes: data.episodes,
      previewPath: fileName,
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
