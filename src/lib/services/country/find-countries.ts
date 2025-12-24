"use server";

import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import * as schema from "../../db/schema";
import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import type { Country } from "../../types/country";

export async function findCountries(locale: Locale = DEFAULT_LOCALE): Promise<Country[]> {
  const rows = await db
    .select({
      id: schema.countries.id,
      name: schema.countryTranslations.name,
    })
    .from(schema.countries)
    .leftJoin(
      schema.countryTranslations,
      and(eq(schema.countryTranslations.countryId, schema.countries.id), eq(schema.countryTranslations.locale, locale))
    );

  return rows;
}
