import { Prisma } from "@prisma/client";
import { ClientArtDto } from "src/dto/art/client-art.dto";

type ArtWithPayload = Prisma.ArtGetPayload<{
  include: {
    type: {
      include: {
        typeTranslations: true;
      };
    };
    country: {
      include: {
        countryTranslations: true;
      };
    };
    artTranslations: true;
    genres: {
      include: {
        genreTranslations: true;
      };
    };
    status: {
      include: {
        statusTranslations: true;
      };
    };
  };
}>;

export const mapArt = (art: ArtWithPayload): ClientArtDto => {
  return {
    id: art.id,
    title: art.artTranslations[0].title,
    description: art.artTranslations[0].description,
    releaseDate: art.releaseDate,
    episodes: art.episodes,
    rating: Number(art.rating?.toFixed(1)),
    previewPath: art.previewPath,
    country: {
      id: art.country.id,
      name: art.country.countryTranslations[0].name,
    },
    type: {
      id: art.type.id,
      name: art.type.typeTranslations[0].name,
      catalogName: art.type.typeTranslations[0].catalogName,
    },
    genres: art.genres.map((genre) => ({
      id: genre.id,
      name: genre.genreTranslations[0].name,
    })),
    status: {
      id: art.status.id,
      name: art.status.statusTranslations[0].name,
    },
  };
};
