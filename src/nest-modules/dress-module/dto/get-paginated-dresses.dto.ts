import {
  GetPaginatedDressesUseCaseInput,
  GetPaginatedDressesUseCaseOutput,
} from "@core/products/application/dress/get-paginated-dresses/get-paginated-dresses.use-case";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DressDto } from "@nest/dress-module/dto/dress.dto";
import { PaginationOutputDto } from "@nest/shared-module/dtos/pagination-output.dto";

export class GetPaginatedDressesInputDto extends GetPaginatedDressesUseCaseInput {
  @ApiProperty({
    name: "page",
    required: false,
    type: "number",
    description: "Número da página",
    default: 1,
  })
  @Type(() => Number)
  declare page?: number;

  @ApiProperty({
    name: "limit",
    required: false,
    type: "number",
    description: "Número de itens por página",
    default: 10,
  })
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
    description: "Modelo do vestido",
  })
  declare model?: string;

  @ApiProperty({
    name: "color",
    required: false,
    type: "string",
    description: "Cor do vestido",
  })
  declare color?: string;

  @ApiProperty({
    name: "fabric",
    required: false,
    type: "string",
    description: "Tecido do vestido",
  })
  declare fabric?: string;

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
      "Se passado como true, retorna apenas os vestidos disponíveis, se passado como false, retorna apenas os vestidos indisponíveis, se não passado, retorna todos os vestidos",
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
}

export class GetPaginatedDressesOutputDto
  extends PaginationOutputDto<DressDto>
  implements GetPaginatedDressesUseCaseOutput
{
  @ApiProperty({
    isArray: true,
    type: DressDto,
    description: "Lista de vestidos",
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
        type: "dress",
      },
    ],
  })
  declare items: DressDto[];
}
