import { Injectable } from "@nestjs/common";
import { Locales, PrismaClient } from "@prisma/client";
import { mapStatus } from "./map-status";

@Injectable()
export class StatusService {
  prisma = new PrismaClient();

  async findAll(locale: Locales) {
    const statuses = await this.prisma.status.findMany({
      include: {
        statusTranslations: {
          where: {
            locale,
          },
        },
      },
    });

    return statuses.map(mapStatus);
  }
}
