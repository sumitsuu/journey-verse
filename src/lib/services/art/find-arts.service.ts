import "server-only";

import { and, between, eq, exists, inArray, SQL, sql } from "drizzle-orm";
import z from "zod";

import { db } from "../../db";
import * as schema from "../../db/schema";
import { localesEnum } from "../../db/schema";

export const FindArtsFiltersSchema = z.object({
  typeId: z.number().int().positive().optional(),
  genres: z.array(z.string()).or(z.string()).optional(),
  rating: z.string().optional(),
  yearStart: z.string().optional(),
  yearEnd: z.string().optional(),
  artId: z.number().int().positive().optional(),
});

export const FindArtsInputSchema = z.object({
  locale: z.enum(localesEnum.enumValues),
  filters: FindArtsFiltersSchema,
});

export type FindArtsInput = z.infer<typeof FindArtsInputSchema>;
export type FindArtsFilters = z.infer<typeof FindArtsFiltersSchema>;
export type FindArtsOutput = Pick<
  typeof schema.arts.$inferSelect,
  "id" | "releaseDate" | "episodes" | "rating" | "previewPath"
> & {
  title: (typeof schema.artTranslations.$inferSelect)["title"];
  description: (typeof schema.artTranslations.$inferSelect)["description"];
  type: Pick<typeof schema.types.$inferSelect, "id"> & {
    name: (typeof schema.typeTranslations.$inferSelect)["name"];
    catalogName: (typeof schema.typeTranslations.$inferSelect)["catalogName"];
  };
  country: Pick<typeof schema.countries.$inferSelect, "id"> & {
    name: (typeof schema.countryTranslations.$inferSelect)["name"];
  };
  status: Pick<typeof schema.statuses.$inferSelect, "id"> & {
    name: (typeof schema.statusTranslations.$inferSelect)["name"];
  };
  genres: (Pick<typeof schema.genres.$inferSelect, "id"> & {
    name: (typeof schema.genreTranslations.$inferSelect)["name"];
  })[];
};

export async function findArts({ locale, filters = {} }: FindArtsInput): Promise<FindArtsOutput[]> {
  const condition = buildFilters(filters);

  const rows = await db
    .select({
      id: schema.arts.id,
      releaseDate: schema.arts.releaseDate,
      episodes: schema.arts.episodes,
      rating: schema.arts.rating,
      previewPath: schema.arts.previewPath,
      title: schema.artTranslations.title,
      description: schema.artTranslations.description,
      type: {
        id: schema.types.id,
        name: schema.typeTranslations.name,
        catalogName: schema.typeTranslations.catalogName,
      },
      country: {
        id: schema.countries.id,
        name: schema.countryTranslations.name,
      },
      status: {
        id: schema.statuses.id,
        name: schema.statusTranslations.name,
      },
      genres: sql<{ id: number; name: string }[]>`
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', ${schema.genres.id}, 'name', ${schema.genreTranslations.name}))
            FROM ${schema.artGenres}
            INNER JOIN ${schema.genres} ON ${schema.genres.id} = ${schema.artGenres.genreId}
            INNER JOIN ${schema.genreTranslations} ON ${schema.genreTranslations.genreId} = ${schema.genres.id}
              AND ${schema.genreTranslations.locale} = ${locale}
            WHERE ${schema.artGenres.artId} = ${schema.arts.id}
          ),
          '[]'::json
        )
      `.as("genres"),
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
    .where(condition.length > 0 ? and(...condition) : undefined);

  return rows;
}

const buildFilters = (filters: FindArtsFilters) => {
  const condition: SQL[] = [];
  const { typeId, genres, rating, yearStart, yearEnd, artId } = filters;

  if (typeId) {
    condition.push(eq(schema.arts.typeId, typeId));
  }

  if (genres && genres.length > 0) {
    const genreIds = Array.isArray(genres) ? genres.map(Number) : [Number(genres)];
    condition.push(
      exists(
        db
          .select()
          .from(schema.artGenres)
          .where(and(eq(schema.artGenres.artId, schema.arts.id), inArray(schema.artGenres.genreId, genreIds)))
      )
    );
  }

  if (rating) {
    const ratingValue = typeof rating === "string" ? parseFloat(rating) : Number(rating);
    if (!isNaN(ratingValue)) {
      condition.push(sql`${schema.arts.rating}::numeric >= ${ratingValue}::numeric`);
    }
  }

  if (yearStart || yearEnd) {
    condition.push(between(sql`EXTRACT(YEAR FROM ${schema.arts.releaseDate})`, yearStart ?? 0, yearEnd ?? 9999));
  }

  if (artId) {
    condition.push(eq(schema.arts.id, artId));
  }

  return condition;
};
