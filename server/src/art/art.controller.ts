import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Locales } from "@prisma/client";
import { GenreService } from "src/genre/genre.service";
import { CreateArtDto } from "../dto/art/create-art.dto";
import { UpdateArtDto } from "../dto/art/update-art.dto";
import { ArtService } from "./art.service";

@Controller("arts")
export class ArtController {
  constructor(
    private readonly artService: ArtService,
    private readonly genreService: GenreService
  ) {}

  @Post("/create")
  @UseInterceptors(FileInterceptor("previewPath"))
  create(
    @UploadedFile() previewPath: Express.Multer.File,
    @Param("locale") locale: Locales,
    @Body() createArtDto: CreateArtDto
  ) {
    return this.artService.create(locale, previewPath, createArtDto);
  }

  @Get("/get/:typeId")
  findAll(@Param("locale") locale: Locales, @Param("typeId") typeId: string, @Query() query: Record<string, string>) {
    return this.artService.findAll(locale, typeId, query);
  }

  @Get("/sort-options/:typeId")
  getSortOptions(@Param("locale") locale: Locales, @Param("typeId") typeId: string) {
    return this.artService.getSortOptions(locale, typeId);
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.artService.findOne(+id);
  // }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateArtDto: UpdateArtDto) {
    return this.artService.update(+id, updateArtDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.artService.remove(+id);
  }
}
