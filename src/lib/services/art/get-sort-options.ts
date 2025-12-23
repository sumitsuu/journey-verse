"use server";

import { and, eq, sql } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { Locale } from "../../i18n/locales";
import type { Status } from "../../types";

export async function getSortOptions(locale: Locale, typeId: string) {
  const genreRows = await db
    .select({
      id: schema.genres.id,
      name: schema.genreTranslations.name,
    })
    .from(schema.types)
    .leftJoin(schema.genres, eq(schema.genres.id, schema.types.id))
    .leftJoin(
      schema.genreTranslations,
      and(eq(schema.genreTranslations.genreId, schema.genres.id), eq(schema.genreTranslations.locale, locale))
    )
    .where(eq(schema.types.id, Number(typeId)));

  const yearRows = await db
    .select({
      year: sql<number>`EXTRACT(YEAR FROM ${schema.arts.releaseDate})::int`,
    })
    .from(schema.arts)
    .groupBy(sql`EXTRACT(YEAR FROM ${schema.arts.releaseDate})`)
    .orderBy(sql`year ASC`);

  const statusRows = await db
    .select({
      id: schema.statuses.id,
      name: schema.statusTranslations.name,
    })
    .from(schema.statuses)
    .leftJoin(
      schema.statusTranslations,
      and(eq(schema.statusTranslations.statusId, schema.statuses.id), eq(schema.statusTranslations.locale, locale))
    );

  const statuses: Status[] = statusRows.map((s) => ({
    id: s.id,
    name: s.name,
  }));

  return {
    genres: genreRows,
    statuses,
    years: yearRows.map((y) => y.year),
  };
}
