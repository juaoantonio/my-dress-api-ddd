import {
  GetPaginatedDressesUseCaseInput,
  GetPaginatedDressesUseCaseOutput,
} from "@core/products/application/dress/get-paginated-dresses/get-paginated-dresses.use-case";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { DressDto } from "@nest/dress-module/dto/dress.dto";

export class GetPaginatedDressesInputDto extends GetPaginatedDressesUseCaseInput {
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
}

export class GetPaginatedDressesOutputDto
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

  @ApiProperty({
    type: "number",
    description: "Número total de vestidos",
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
