import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { mapGenre } from "./map-genre";

@Injectable()
export class GenreService {
  prisma = new PrismaClient();

  async findAll() {
    const genres = await this.prisma.genre.findMany({
      include: {
        genreTranslations: true,
      },
    });

    return genres.map(mapGenre);
  }
}
