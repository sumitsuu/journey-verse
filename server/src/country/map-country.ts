import { Prisma } from "@prisma/client";
import { ClientCountryDto } from "src/dto/country/client-country.dto";

type CountryWithTranslations = Prisma.CountryGetPayload<{
  include: {
    countryTranslations: true;
  };
}>;

export const mapCountry = (country: CountryWithTranslations): ClientCountryDto => {
  return {
    id: country.id,
    name: country.countryTranslations[0].name,
  };
};
