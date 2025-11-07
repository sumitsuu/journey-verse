import { Controller, Get, HttpException, HttpStatus, Param } from "@nestjs/common";
import { Locales } from "@prisma/client";
import { TypeService } from "./type.service";

@Controller("type")
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Get()
  async findAll(@Param("locale") locale: Locales) {
    try {
      return await this.typeService.findAll(locale);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
