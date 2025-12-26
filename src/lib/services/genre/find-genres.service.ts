import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import type { Genre } from "../../types/genre";

export async function findGenres(locale: Locale = DEFAULT_LOCALE): Promise<Genre[]> {
  const rows = await db
    .select({
      id: schema.genres.id,
      name: schema.genreTranslations.name,
    })
    .from(schema.genres)
    .leftJoin(
      schema.genreTranslations,
      and(eq(schema.genreTranslations.genreId, schema.genres.id), eq(schema.genreTranslations.locale, locale))
    );

  return rows;
}
