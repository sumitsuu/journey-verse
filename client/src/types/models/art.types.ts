import { Country } from "./country.types";
import { Genre } from "./genre.types";
import { Status } from "./status.types";
import { Type } from "./type.types";

export type Art = {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  previewPath: string;
  status: Status;
  rating: number;
  country: Country;
  episodes: number | null;
  genres: Genre[];
  type: Type;
};
