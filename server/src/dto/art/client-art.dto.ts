import { ClientCountryDto } from "../country/client-country.dto";
import { ClientGenreDto } from "../genre/client-genre.dto";
import { ClientStatusDto } from "../status/client-status.dto";
import { ClientTypeDto } from "../type/client-type.dto";

export class ClientArtDto {
  id: number;
  title: string;
  description: string;
  releaseDate: Date;
  episodes: number | null;
  country: ClientCountryDto;
  type: ClientTypeDto;
  genres: ClientGenreDto[];
  status: ClientStatusDto;
  rating: number;
  previewPath: string;
}
