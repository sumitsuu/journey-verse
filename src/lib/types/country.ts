import type { InferSelectModel } from "drizzle-orm";

import { countries, countryTranslations } from "../db/schema";

type CountryRow = InferSelectModel<typeof countries>;
type CountryTranslationRow = InferSelectModel<typeof countryTranslations>;

export type Country = {
  id: CountryRow["id"];
  name: CountryTranslationRow["name"] | null;
};
