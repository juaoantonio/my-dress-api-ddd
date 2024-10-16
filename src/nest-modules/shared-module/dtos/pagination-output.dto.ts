import { ApiProperty } from "@nestjs/swagger";
import { PaginationOutput } from "@core/@shared/application/pagination-output";

export class PaginationOutputDto<T> implements PaginationOutput<T> {
  declare items: T[];

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

  @ApiProperty({
    type: "boolean",
    description: "Indica se é a primeira página",
    example: true,
  })
  declare isFirstPage: boolean;

  @ApiProperty({
    type: "boolean",
    description: "Indica se é a última página",
    example: true,
  })
  declare isLastPage: boolean;
}
