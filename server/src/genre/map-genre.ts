import { Prisma } from "@prisma/client";
import { ClientGenreDto } from "src/dto/genre/client-genre.dto";

type GenreWithTranslations = Prisma.GenreGetPayload<{
  include: {
    genreTranslations: true;
  };
}>;

export const mapGenre = (genre: GenreWithTranslations): ClientGenreDto => {
  return {
    id: genre.id,
    name: genre.genreTranslations[0].name,
  };
};
