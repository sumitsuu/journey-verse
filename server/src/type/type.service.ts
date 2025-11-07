import { Injectable } from "@nestjs/common";
import { Locales, PrismaClient } from "@prisma/client";
import { mapType } from "./map-type";

@Injectable()
export class TypeService {
  prisma = new PrismaClient();

  async findAll(locale: Locales) {
    const types = await this.prisma.type.findMany({
      include: {
        typeTranslations: {
          where: {
            locale,
          },
        },
      },
    });

    return types.map(mapType);
  }
}
