import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "../../../db";
import * as schema from "../../../db/schema";
import type { Type } from "../../../types/type";
import { FindTypesInput } from "./schemas";

export async function findTypes({ locale }: FindTypesInput): Promise<Type[]> {
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
