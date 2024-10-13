import {
  GetPaginatedClutchesUseCaseInput,
  GetPaginatedClutchesUseCaseOutput,
} from "@core/products/application/clutch/get-paginated-clutches/get-paginated-clutches.use-case";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ClutchDto } from "@nest/clutch-module/dto/clutch.dto";

export class GetPaginatedClutchesInputDto extends GetPaginatedClutchesUseCaseInput {
  @ApiProperty({
    name: "page",
    required: false,
    type: "number",
    description: "Número da página",
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  declare page: number;

  @ApiProperty({
    name: "limit",
    required: false,
    type: "number",
    description: "Número de itens por página",
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  declare limit: number;

  @ApiProperty({
    name: "available",
    required: false,
    description:
      "Se passado como true, retorna apenas as bolsas disponíveis, se passado como false, retorna apenas as bolsas indisponíveis, se não passado, retorna todos as bolsas",
  })
  @Transform(({ value }) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return Boolean(value);
  })
  declare available: boolean;

  @ApiProperty({
    name: "startDate",
    required: false,
    type: "string",
    description:
      "Data de início do intervalo de datas. É obrigatória se for passada a propriedade available",
  })
  declare startDate: string;

  @ApiProperty({
    name: "endDate",
    required: false,
    type: "string",
    description:
      "Data de fim do intervalo de datas. É obrigatória se for passada a propriedade available",
  })
  declare endDate: string;
}

export class GetPaginatedClutchesOutputDto
  implements GetPaginatedClutchesUseCaseOutput
{
  @ApiProperty({
    isArray: true,
    type: ClutchDto,
    description: "Lista de bolsas",
    example: [
      {
        id: "667cb46b-fd52-4a5b-bdb2-1d8cc2e525ef",
        rentPrice: 150,
        name: "Vermelho, Longo, Cetim",
        color: "Vermelho",
        model: "Longo",
        fabric: "Cetim",
        isPickedUp: false,
        imageUrl: "https://example.com/image1.jpg",
        type: "clutch",
      },
    ],
  })
  declare items: ClutchDto[];

  @ApiProperty({
    type: "number",
    description: "Número total de bolsas",
    example: 1,
  })
  declare total: number;

  @ApiProperty({
    type: "number",
    description: "Número da página atual",
    example: 1,
  })
  declare currentPage: number;

  @ApiProperty({
    type: "number",
    description: "Número de itens por página",
    example: 10,
  })
  declare perPage: number;

  @ApiProperty({
    type: "number",
    description: "Número da última página",
    example: 1,
  })
  declare lastPage: number;
}