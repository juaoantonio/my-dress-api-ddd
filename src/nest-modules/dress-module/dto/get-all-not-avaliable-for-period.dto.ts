import { GetAllNotAvailableForPeriodInput } from "@core/products/application/dress/get-all-not-available-for-period/get-all-not-available-for-period.use.case";
import { ApiProperty } from "@nestjs/swagger";
import { DressDto } from "@nest/dress-module/dto/dress.dto";

export class GetAllNotAvailableForPeriodInputDto extends GetAllNotAvailableForPeriodInput {
  @ApiProperty({
    description: "Data de fim do período de busca",
    default: new Date().toISOString(),
  })
  declare startDate: string;

  @ApiProperty({
    description: "Data de início do período de busca",
    default: new Date(
      new Date().setDate(new Date().getDate() + 1),
    ).toISOString(),
  })
  declare endDate: string;
}

export type GetAllNotAvailableForPeriodOutputDto = DressDto[];
