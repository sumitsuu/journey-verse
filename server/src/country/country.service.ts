import { Injectable } from "@nestjs/common";
import { Locales, PrismaClient } from "@prisma/client";
import { mapCountry } from "./map-country";

@Injectable()
export class CountryService {
  prisma = new PrismaClient();

  async findAll(locale: Locales) {
    const countries = await this.prisma.country.findMany({
      include: {
        countryTranslations: {
          where: { locale },
        },
      },
    });

    return countries.map((country) => mapCountry(country));
  }
}
