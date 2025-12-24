"use server";

import { z } from "zod";

import type { Locale } from "../../i18n/locales";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { findStatuses } from "../../services/status/find-statuses";
import type { Status } from "../../types/status";

const findStatusesSchema = z.object({
  locale: z.enum(["en", "ru"]).optional(),
});

export async function findStatusesAction(
  data: z.infer<typeof findStatusesSchema>
): Promise<{ success: true; data: Status[] } | { success: false; error: string }> {
  try {
    const validated = findStatusesSchema.parse(data);
    const locale = (validated.locale as Locale) || DEFAULT_LOCALE;
    const result = await findStatuses(locale);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to find statuses",
    };
  }
}
