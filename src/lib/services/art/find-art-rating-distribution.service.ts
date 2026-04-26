import "server-only";

import { and, eq, isNotNull, sql } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";

export type ArtRatingDistributionItem = {
  stars: number;
  count: number;
  percentage: number;
};

export async function findArtRatingDistribution(artId: number): Promise<ArtRatingDistributionItem[]> {
  const bucketSql = sql`LEAST(10, GREATEST(1, ROUND(${schema.library.rating}::numeric)))`;

  const rows = await db
    .select({
      stars: bucketSql,
      count: sql<number>`count(*)::int`,
    })
    .from(schema.library)
    .where(and(eq(schema.library.artId, artId), isNotNull(schema.library.rating)))
    .groupBy(bucketSql);

  const byStars = new Map<number, number>();
  for (let s = 1; s <= 10; s++) {
    byStars.set(s, 0);
  }
  for (const row of rows) {
    byStars.set(Number(row.stars), Number(row.count));
  }
  const total = [...byStars.values()].reduce((a, b) => a + b, 0);

  const result: ArtRatingDistributionItem[] = [];
  for (let stars = 10; stars >= 1; stars--) {
    const count = byStars.get(stars) ?? 0;
    const percentage = total > 0 ? (count / total) * 100 : 0;
    result.push({ stars, count, percentage });
  }
  return result;
}
