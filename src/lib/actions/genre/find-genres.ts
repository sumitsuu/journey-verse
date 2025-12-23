"use server";

import { z } from "zod";

import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { findGenres } from "../../services/genre/find-genres";
import type { Genre } from "../../types";

const findGenresSchema = z.object({
  locale: z.enum(["en", "ru"]).optional(),
});

export async function findGenresAction(
  data: z.infer<typeof findGenresSchema>
): Promise<{ success: true; data: Genre[] } | { success: false; error: string }> {
  try {
    const validated = findGenresSchema.parse(data);
    const locale = (validated.locale as Locale) || DEFAULT_LOCALE;
    const result = await findGenres(locale);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to find genres",
    };
  }
}
