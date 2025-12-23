import type { InferSelectModel } from "drizzle-orm";

import {
  arts,
  artTranslations,
  countries,
  countryTranslations,
  statuses,
  statusTranslations,
  types,
  typeTranslations,
} from "../db/schema";
import type { Genre } from "./genre";

type ArtRow = InferSelectModel<typeof arts>;
type ArtTranslationRow = InferSelectModel<typeof artTranslations>;
type CountryRow = InferSelectModel<typeof countries>;
type CountryTranslationRow = InferSelectModel<typeof countryTranslations>;
type StatusRow = InferSelectModel<typeof statuses>;
type StatusTranslationRow = InferSelectModel<typeof statusTranslations>;
type TypeRow = InferSelectModel<typeof types>;
type TypeTranslationRow = InferSelectModel<typeof typeTranslations>;

export type Art = {
  id: ArtRow["id"];
  title: ArtTranslationRow["title"];
  description: ArtTranslationRow["description"];
  releaseDate: ArtRow["releaseDate"];
  episodes: ArtRow["episodes"];
  countryId: CountryRow["id"];
  countryName: CountryTranslationRow["name"];
  typeId: TypeRow["id"];
  typeName: TypeTranslationRow["name"];
  typeCatalogName: TypeTranslationRow["catalogName"];
  genres?: Genre[];
  statusId: StatusRow["id"];
  statusName: StatusTranslationRow["name"];
  rating: ArtRow["rating"] | null;
  previewPath: ArtRow["previewPath"] | null;
};
