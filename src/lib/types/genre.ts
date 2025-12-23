import type { InferSelectModel } from "drizzle-orm";

import { genreTranslations, genres } from "../db/schema";

type GenreRow = InferSelectModel<typeof genres>;
type GenreTranslationRow = InferSelectModel<typeof genreTranslations>;

export type Genre = {
  id: GenreRow["id"];
  name: GenreTranslationRow["name"] | null;
};
