"use server";

import { and, between, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { Locale } from "../../i18n/locales";
import type { Art } from "../../types";

export async function findArts(
  locale: Locale,
  typeId: number,
  query: {
    genres?: string[];
    rating?: number;
    yearStart?: string;
    yearEnd?: string;
  }
): Promise<Art[]> {
  const where = and(
    eq(schema.arts.typeId, typeId),
    query.rating ? gte(schema.arts.rating, query.rating.toString()) : undefined,
    query.yearStart || query.yearEnd
      ? between(
          sql`EXTRACT(YEAR FROM ${schema.arts.releaseDate})`,
          query.yearStart ? Number(query.yearStart) : 0,
          query.yearEnd ? Number(query.yearEnd) : 9999
        )
      : undefined
  );

  const rows = await db
    .select({
      id: schema.arts.id,
      releaseDate: schema.arts.releaseDate,
      episodes: schema.arts.episodes,
      rating: schema.arts.rating,
      previewPath: schema.arts.previewPath,
      title: schema.artTranslations.title,
      description: schema.artTranslations.description,
      typeId: schema.types.id,
      typeName: schema.typeTranslations.name,
      typeCatalogName: schema.typeTranslations.catalogName,
      countryId: schema.countries.id,
      countryName: schema.countryTranslations.name,
      statusId: schema.statuses.id,
      statusName: schema.statusTranslations.name,
    })
    .from(schema.arts)
    .innerJoin(
      schema.artTranslations,
      and(eq(schema.artTranslations.artId, schema.arts.id), eq(schema.artTranslations.locale, locale))
    )
    .innerJoin(schema.types, eq(schema.types.id, schema.arts.typeId))
    .innerJoin(
      schema.typeTranslations,
      and(eq(schema.typeTranslations.typeId, schema.types.id), eq(schema.typeTranslations.locale, locale))
    )
    .innerJoin(schema.countries, eq(schema.countries.id, schema.arts.countryId))
    .innerJoin(
      schema.countryTranslations,
      and(eq(schema.countryTranslations.countryId, schema.countries.id), eq(schema.countryTranslations.locale, locale))
    )
    .innerJoin(schema.statuses, eq(schema.statuses.id, schema.arts.statusId))
    .innerJoin(
      schema.statusTranslations,
      and(eq(schema.statusTranslations.statusId, schema.statuses.id), eq(schema.statusTranslations.locale, locale))
    )
    .where(where)
    .orderBy(desc(schema.arts.releaseDate));

  return rows;
}
