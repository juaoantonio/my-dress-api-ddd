import {
  AddAdjustmentsOutput,
  AdjustmentInput,
} from "@core/booking/application/add-adjustments/add-adjustments.use-case";
import { ApiProperty } from "@nestjs/swagger";

export class AdjustmentInputDto extends AdjustmentInput {
  @ApiProperty({
    name: "label",
    description: "Rótulo do ajuste",
  })
  declare label: string;

  @ApiProperty({
    name: "description",
    description: "Descrição do ajuste",
  })
  declare description: string;

  @ApiProperty({
    name: "dressId",
    description: "Identificador do vestido",
  })
  declare dressId: string;
}

export class AddAdjustmentInputDto {
  @ApiProperty({
    name: "adjustments",
    description: "Ajustes",
    type: [AdjustmentInputDto],
  })
  adjustments: AdjustmentInputDto[];
}

export class AddAdjustmentOutputDto extends AddAdjustmentsOutput {
  @ApiProperty({
    name: "bookingId",
    description: "Identificador da reserva",
  })
  declare bookingId: string;
}
