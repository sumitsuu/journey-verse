import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateArtDto {
  @IsString()
  @IsNotEmpty()
  releaseDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  countryId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  typeId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  statusId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  genres: number[];
}
