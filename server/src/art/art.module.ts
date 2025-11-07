import { Module } from "@nestjs/common";
import { GenreService } from "src/genre/genre.service";
import { ArtController } from "./art.controller";
import { ArtService } from "./art.service";

@Module({
  controllers: [ArtController],
  providers: [ArtService, GenreService],
})
export class ArtModule {}
