import {
  GetPaginatedDressesUseCaseOutput,
  OutputDress,
} from "@core/products/application/dress/get-paginated-dresses/get-paginated-dresses.use-case";
import { ApiProperty } from "@nestjs/swagger";

export class GetPaginatedDressesOutputDto extends GetPaginatedDressesUseCaseOutput {
  @ApiProperty({
    isArray: true,
    type: OutputDress,
    description: "Lista de vestidos",
    example: [
      {
        id: "3d02de1e-2046-43ca-8d32-66b930f7a422",
        rentPrice: 100,
        name: "Azul Modelo 1 Tecido 1",
        color: "Azul",
        model: "Modelo 1",
        fabric: "Tecido 1",
        isPickedUp: false,
        imageUrl: "https://url.com",
        type: "Vestido",
      },
    ],
  })
  declare items: OutputDress[];

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
