import { Controller, Get, HttpException, HttpStatus, Param } from "@nestjs/common";
import { Locales } from "@prisma/client";
import { StatusService } from "./status.service";

@Controller("status")
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  async findAll(@Param("locale") locale: Locales) {
    try {
      return await this.statusService.findAll(locale);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
