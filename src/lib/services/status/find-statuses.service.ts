import "server-only";

import { and, eq } from "drizzle-orm";

import z from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { localesEnum, statusTypeEnum } from "../../db/schema";

export const FindStatusesInputSchema = z.object({
  locale: z.enum(localesEnum.enumValues),
  type: z.enum(statusTypeEnum.enumValues),
});

export type FindStatusesInput = z.infer<typeof FindStatusesInputSchema>;
export type FindStatusesOutput = Pick<typeof schema.statuses.$inferSelect, "id" | "type"> & {
  name: (typeof schema.statusTranslations.$inferSelect)["name"];
};

export async function findStatuses({ locale, type }: FindStatusesInput): Promise<FindStatusesOutput[]> {
  const rows = await db
    .select({
      id: schema.statuses.id,
      type: schema.statuses.type,
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
