import { GetPaginatedDressesUseCaseInput } from "@core/products/application/dress/get-paginated-dresses/get-paginated-dresses.use-case";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class GetPaginatedDressesDto extends GetPaginatedDressesUseCaseInput {
  @ApiProperty({
    name: "page",
    required: false,
    type: "number",
    description: "Número da página",
  })
  @IsOptional()
  @Type(() => Number)
  declare page: number;

  @ApiProperty({
    name: "limit",
    required: false,
    type: "number",
    description: "Número de itens por página",
  })
  @IsOptional()
  @Type(() => Number)
  declare limit: number;
}
