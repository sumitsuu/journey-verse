import {
  arts,
  artTranslations,
  countries,
  countryTranslations,
  genres,
  genreTranslations,
  statuses,
  statusTranslations,
  types,
  typeTranslations,
} from "../db/schema";

type Country = {
  id: (typeof countries.$inferSelect)["id"];
  name: (typeof countryTranslations.$inferSelect)["name"];
};

type ArtType = {
  id: (typeof types.$inferSelect)["id"];
  name: (typeof typeTranslations.$inferSelect)["name"];
  catalogName: (typeof typeTranslations.$inferSelect)["catalogName"];
};

type Status = {
  id: (typeof statuses.$inferSelect)["id"] | null;
  name: (typeof statusTranslations.$inferSelect)["name"] | null;
};

export type Genre = {
  id: (typeof genres.$inferSelect)["id"];
  name: (typeof genreTranslations.$inferSelect)["name"];
};

export type Art = Pick<typeof arts.$inferSelect, "id" | "releaseDate" | "episodes" | "rating" | "previewPath"> & {
  title: (typeof artTranslations.$inferSelect)["title"];
  description: (typeof artTranslations.$inferSelect)["description"];
  country: Country;
  type: ArtType;
  status: Status;
  genres: Genre[];
};
