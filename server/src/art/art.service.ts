import { Injectable } from "@nestjs/common";
import { Locales, Prisma, PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { ClientGenreDto } from "src/dto/genre/client-genre.dto";
import { mapGenre } from "src/genre/map-genre";
import { mapStatus } from "src/status/map-status";
import { CreateArtDto } from "../dto/art/create-art.dto";
import { UpdateArtDto } from "../dto/art/update-art.dto";
import { mapArt } from "./map-art";

@Injectable()
export class ArtService {
  prisma = new PrismaClient();

  async create(locale: Locales, previewPath: Express.Multer.File, newArt: CreateArtDto) {
    const uploadDir = path.join(__dirname, "..", "..", "client", "arts");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${previewPath.originalname}`;

    const filePath = path.join(uploadDir, fileName);

    // Start a Prisma transaction
    const transaction = await this.prisma.$transaction(async (prisma) => {
      // Save the image to the disk first
      try {
        fs.writeFileSync(filePath, previewPath.buffer);

        // Try to create the record in the database
        const createdArt = await prisma.art.create({
          data: {
            releaseDate: newArt.releaseDate,
            countryId: newArt.countryId,
            typeId: newArt.typeId,
            statusId: newArt.statusId,
            previewPath: fileName,
            genres: {
              connect: newArt.genres.map((genreId) => ({
                id: Number(genreId),
              })),
            },
            artTranslations: {
              create: {
                locale,
                title: newArt.title,
                description: newArt.description,
              },
            },
          },
        });

        return createdArt;
      } catch (error) {
        // Rollback if something goes wrong
        fs.unlinkSync(filePath); // Delete the image if there was an error
        throw error; // Re-throw the error to let Prisma handle the transaction rollback
      }
    });

    return transaction;
  }

  async findAll(
    locale: Locales,
    typeId: string,
    query: {
      genres: string[];
      rating: number;
      yearStart: string;
      yearEnd: string;
    }
  ) {
    const processFilters = () => {
      const result: Prisma.ArtWhereInput = {};

      result.typeId = Number(typeId);

      const genres = query["genres"] ?? query.genres;

      if (genres) {
        const genreArray = Array.isArray(genres) ? genres : [genres];
        result.genres = {
          some: {
            id: { in: genreArray.map(Number) },
          },
        };
      }

      result.rating = {
        gte: query.rating ? Number(query.rating) : undefined,
      };

      result.releaseDate = {
        gte: query.yearStart ? new Date(`${query.yearStart}-01-01`) : undefined,
        lte: query.yearEnd ? new Date(`${query.yearEnd}-12-31`) : undefined,
      };

      return result;
    };

    const arts = await this.prisma.art.findMany({
      where: processFilters(),
      include: {
        artTranslations: {
          where: { locale },
        },
        type: {
          include: {
            typeTranslations: {
              where: { locale },
            },
          },
        },
        status: {
          include: {
            statusTranslations: {
              where: { locale },
            },
          },
        },
        country: {
          include: {
            countryTranslations: {
              where: { locale },
            },
          },
        },
        genres: {
          include: {
            genreTranslations: {
              where: { locale },
            },
          },
        },
      },
    });

    if (!arts?.length) {
      return [];
    }

    return arts.map((art) => mapArt(art));
  }

  findOne(id: number) {
    return `This action returns a #${id} art`;
  }

  update(id: number, updateArtDto: UpdateArtDto) {
    return `This action updates a #${id} art`;
  }

  remove(id: number) {
    return `This action removes a #${id} art`;
  }

  async getSortOptions(locale: Locales, typeId: string) {
    let genres: ClientGenreDto[] | undefined;
    const genresFromType = await this.prisma.type.findUnique({
      where: {
        id: Number(typeId),
      },
      select: {
        genres: {
          include: {
            genreTranslations: {
              where: { locale },
            },
          },
        },
      },
    });

    if (genresFromType) {
      genres = genresFromType.genres.map(mapGenre);
    }

    const uniqueYears = await this.prisma.art.findMany({
      select: {
        releaseDate: true,
      },
      distinct: ["releaseDate"],
    });

    const statuses = await this.prisma.status.findMany({
      include: {
        statusTranslations: {
          where: { locale },
        },
      },
    });

    return {
      genres,
      statuses: statuses.map(mapStatus),
      years: [...new Set(uniqueYears.map((art) => new Date(art.releaseDate).getFullYear()))],
    };
  }
}
