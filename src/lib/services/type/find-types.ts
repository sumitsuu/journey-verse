"use server";

import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import type { Type } from "../../types";

export async function findTypes(locale: Locale = DEFAULT_LOCALE): Promise<Type[]> {
  const rows = await db
    .select({
      id: schema.types.id,
      name: schema.typeTranslations.name,
      catalogName: schema.typeTranslations.catalogName,
    })
    .from(schema.types)
    .leftJoin(
      schema.typeTranslations,
      and(eq(schema.typeTranslations.typeId, schema.types.id), eq(schema.typeTranslations.locale, locale))
    );

  return rows;
}
