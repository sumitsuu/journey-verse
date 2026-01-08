import "server-only";

import { and, eq, isNotNull, sql } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import { updateArt } from "./update-art.service";

export async function recalculateArtRating(artId: number): Promise<void> {
  const [result] = await db
    .select({
      avgRating: sql<number | null>`AVG(${schema.library.rating}::numeric)`,
    })
    .from(schema.library)
    .where(and(eq(schema.library.artId, artId), isNotNull(schema.library.rating)));

  const averageRating = result?.avgRating ? Number(result.avgRating) : null;

  await updateArt({
    artId,
    rating: averageRating !== null ? averageRating : undefined,
  });
}

