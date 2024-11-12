import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsUUID } from "class-validator";

export class AddBookingItemsDressDto {
  @ApiProperty({
    name: "dressId",
    description: "Identificador do vestido",
  })
  @IsUUID("4")
  dressId: string;
}

export class AddBookingItemsClutchDto {
  @ApiProperty({
    name: "clutchId",
    description: "Identificador da bolsa",
  })
  @IsUUID("4")
  clutchId: string;

  @ApiProperty({
    name: "isCourtesy",
    description: "Cortesia",
  })
  @IsBoolean()
  isCourtesy: boolean = false;
}

export class AddBookingItemsInputDto {
  @ApiProperty({
    name: "dresses",
    description: "Identificadores dos vestidos",
    type: AddBookingItemsDressDto,
  })
  @IsArray()
  dresses: AddBookingItemsDressDto[];

  @ApiProperty({
    name: "clutches",
    description: "Identificadores das bolsas",
    type: AddBookingItemsClutchDto,
  })
  @IsArray()
  clutches: AddBookingItemsClutchDto[];
}
