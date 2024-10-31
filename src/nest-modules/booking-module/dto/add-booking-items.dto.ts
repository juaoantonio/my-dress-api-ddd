import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class AddBookingItemsInputDto {
  @ApiProperty({
    name: "dressIds",
    description: "Identificadores dos vestidos",
  })
  @IsArray()
  @IsUUID("4", { each: true })
  dressIds: string[];

  @ApiProperty({
    name: "clutchIds",
    description: "Identificadores das bolsas",
  })
  @IsArray()
  @IsUUID("4", { each: true })
  clutchIds: string[];
}
