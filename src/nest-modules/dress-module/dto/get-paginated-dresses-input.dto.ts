import { GetPaginatedDressesUseCaseInput } from "@core/products/application/dress/get-paginated-dresses/get-paginated-dresses.use-case";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";

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
