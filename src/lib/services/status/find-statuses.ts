"use server";

import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import type { Status } from "../../types/status";

export async function findStatuses(locale: Locale = DEFAULT_LOCALE): Promise<Status[]> {
  const rows = await db
    .select({
      id: schema.statuses.id,
      name: schema.statusTranslations.name,
    })
    .from(schema.statuses)
    .leftJoin(
      schema.statusTranslations,
      and(eq(schema.statusTranslations.statusId, schema.statuses.id), eq(schema.statusTranslations.locale, locale))
    );

  return rows;
}
