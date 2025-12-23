"use server";

import { z } from "zod";

import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { findTypes } from "../../services/type/find-types";
import type { Type } from "../../types";

const findTypesSchema = z.object({
  locale: z.enum(["en", "ru"]).optional(),
});

export async function findTypesAction(
  data: z.infer<typeof findTypesSchema>
): Promise<{ success: true; data: Type[] } | { success: false; error: string }> {
  try {
    const validated = findTypesSchema.parse(data);
    const locale = (validated.locale as Locale) || DEFAULT_LOCALE;
    const result = await findTypes(locale);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to find types",
    };
  }
}
