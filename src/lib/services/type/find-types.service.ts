import "server-only";

import { and, eq } from "drizzle-orm";

import z from "zod";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { localesEnum } from "../../db/schema";

export const FindTypesInputSchema = z.object({
  locale: z.enum(localesEnum.enumValues),
});

export type FindTypesInput = z.infer<typeof FindTypesInputSchema>;
export type FindTypesOutput = Pick<typeof schema.types.$inferSelect, "id"> & {
  name: (typeof schema.typeTranslations.$inferSelect)["name"] | null;
  catalogName: (typeof schema.typeTranslations.$inferSelect)["catalogName"] | null;
};

export async function findTypes({ locale }: FindTypesInput): Promise<FindTypesOutput[]> {
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
