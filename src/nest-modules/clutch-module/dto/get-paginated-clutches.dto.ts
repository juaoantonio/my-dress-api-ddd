import {
  GetPaginatedClutchesUseCaseInput,
  GetPaginatedClutchesUseCaseOutput,
} from "@core/products/application/clutch/get-paginated-clutches/get-paginated-clutches.use-case";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ClutchDto } from "@nest/clutch-module/dto/clutch.dto";
import { PaginationOutputDto } from "@nest/shared-module/dtos/pagination-output.dto";

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
  declare page?: number;

  @ApiProperty({
    name: "limit",
    required: false,
    type: "number",
    description: "Número de itens por página",
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  declare limit?: number;

  @ApiProperty({
    name: "name",
    required: false,
    type: "string",
    description: "Nome do vestido",
  })
  declare name?: string;

  @ApiProperty({
    name: "model",
    required: false,
    type: "string",
    description: "Modelo da bolsa",
  })
  declare model?: string;

  @ApiProperty({
    name: "color",
    required: false,
    type: "string",
    description: "Cor da bolsa",
  })
  declare color?: string;

  @ApiProperty({
    name: "rentPrice",
    required: false,
    type: "number",
    description: "Preço do aluguel",
  })
  declare rentPrice?: number;

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
  declare available?: boolean;

  @ApiProperty({
    name: "startDate",
    required: false,
    type: "string",
    description:
      "Data de início do intervalo de datas. É obrigatória se for passada a propriedade available",
  })
  declare startDate?: string;

  @ApiProperty({
    name: "endDate",
    required: false,
    type: "string",
    description:
      "Data de fim do intervalo de datas. É obrigatória se for passada a propriedade available",
  })
  declare endDate?: string;

  @ApiProperty({
    name: "bookingId",
    required: false,
    type: "string",
    description: "Id da reserva",
  })
  declare bookingId?: string;
}

export class GetPaginatedClutchesOutputDto
  extends PaginationOutputDto<ClutchDto>
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
        name: "Prata, Sem alça",
        color: "Prata",
        model: "Sem alça",
        isPickedUp: false,
        imageUrl: "https://example.com/image1.jpg",
        type: "clutch",
      },
    ],
  })
  declare items: ClutchDto[];
}
