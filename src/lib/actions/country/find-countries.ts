"use server";

import { z } from "zod";

import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { findCountries } from "../../services/country/find-countries";
import type { Country } from "../../types/country";

const findCountriesSchema = z.object({
  locale: z.enum(["en", "ru"]).optional(),
});

export async function findCountriesAction(
  data: z.infer<typeof findCountriesSchema>
): Promise<{ success: true; data: Country[] } | { success: false; error: string }> {
  try {
    const validated = findCountriesSchema.parse(data);
    const locale = (validated.locale as Locale) || DEFAULT_LOCALE;
    const result = await findCountries(locale);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to find countries",
    };
  }
}
