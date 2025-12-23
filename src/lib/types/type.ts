import type { InferSelectModel } from "drizzle-orm";

import { types, typeTranslations } from "../db/schema";

type TypeRow = InferSelectModel<typeof types>;
type TypeTranslationRow = InferSelectModel<typeof typeTranslations>;

export type Type = {
  id: TypeRow["id"];
  name: TypeTranslationRow["name"] | null;
  catalogName: TypeTranslationRow["catalogName"] | null;
};
