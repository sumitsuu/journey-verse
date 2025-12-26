import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { Status } from "../../types/status";
import { FindStatusesInput } from "./schemas";

export async function findStatuses({ locale, type }: FindStatusesInput): Promise<Status[]> {
  const rows = await db
    .select({
      id: schema.statuses.id,
      name: schema.statusTranslations.name,
    })
    .from(schema.statuses)
    .innerJoin(
      schema.statusTranslations,
      and(eq(schema.statusTranslations.statusId, schema.statuses.id), eq(schema.statusTranslations.locale, locale))
    )
    .where(eq(schema.statuses.type, type));

  return rows;
}
