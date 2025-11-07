import { Controller, Get, HttpException, HttpStatus, Param } from "@nestjs/common";
import { Locales } from "@prisma/client";
import { CountryService } from "./country.service";

@Controller("country")
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll(@Param("locale") locale: Locales) {
    try {
      return await this.countryService.findAll(locale);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
