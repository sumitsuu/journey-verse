"use server";

import { z } from "zod";

import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { findArts } from "../../services/art/find-arts";
import type { Art } from "../../types";

const findArtsSchema = z.object({
  locale: z.enum(["en", "ru"]).optional(),
  typeId: z.number().int().positive(),
  query: z
    .object({
      genres: z.array(z.string()).optional(),
      rating: z.number().optional(),
      yearStart: z.string().optional(),
      yearEnd: z.string().optional(),
    })
    .optional(),
});

export async function findArtsAction(
  data: z.infer<typeof findArtsSchema>
): Promise<{ success: true; data: Art[] } | { success: false; error: string }> {
  try {
    const validated = findArtsSchema.parse(data);
    const locale = (validated.locale as Locale) || DEFAULT_LOCALE;
    const result = await findArts(locale, validated.typeId, validated.query || {});
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to find arts",
    };
  }
}
