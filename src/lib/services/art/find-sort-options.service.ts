import "server-only";

import { and, eq, sql } from "drizzle-orm";

import z from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { localesEnum } from "../../db/schema";

export const FindSortOptionsInputSchema = z.object({
  locale: z.enum(localesEnum.enumValues),
  typeId: z.number().int().positive(),
});

export type FindSortOptionsInput = z.infer<typeof FindSortOptionsInputSchema>;
export type FindSortOptionsOutput = {
  genres: (Pick<typeof schema.genres.$inferSelect, "id"> & {
    name: (typeof schema.genreTranslations.$inferSelect)["name"];
  })[];
  statuses: (Pick<typeof schema.statuses.$inferSelect, "id"> & {
    name: (typeof schema.statusTranslations.$inferSelect)["name"];
  })[];
  years: number[];
};

export async function findSortOptions({ locale, typeId }: FindSortOptionsInput): Promise<FindSortOptionsOutput> {
  const genres = await db
    .select({
      id: schema.genres.id,
      name: schema.genreTranslations.name,
    })
    .from(schema.genres)
    .innerJoin(schema.genreTypes, eq(schema.genreTypes.genreId, schema.genres.id))
    .innerJoin(
      schema.genreTranslations,
      and(eq(schema.genreTranslations.genreId, schema.genres.id), eq(schema.genreTranslations.locale, locale))
    )
    .where(eq(schema.genreTypes.typeId, typeId));

  const yearRows = await db
    .select({
      year: sql<number>`EXTRACT(YEAR FROM ${schema.arts.releaseDate})::int`,
    })
    .from(schema.arts)
    .groupBy(sql`EXTRACT(YEAR FROM ${schema.arts.releaseDate})`)
    .orderBy(sql`EXTRACT(YEAR FROM ${schema.arts.releaseDate}) ASC`);

  const statuses = await db
    .select({
      id: schema.statuses.id,
      name: schema.statusTranslations.name,
    })
    .from(schema.statuses)
    .innerJoin(
      schema.statusTranslations,
      and(eq(schema.statusTranslations.statusId, schema.statuses.id), eq(schema.statusTranslations.locale, locale))
    );

  return {
    genres,
    statuses,
    years: yearRows.map((row) => row.year),
  };
}
