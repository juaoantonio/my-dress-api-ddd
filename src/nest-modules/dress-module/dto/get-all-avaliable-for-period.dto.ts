import { ApiProperty } from "@nestjs/swagger";
import { GetAllAvailableForPeriodInput } from "@core/products/application/dress/get-all-available-for-period/get-all-available-for-period.use-case";
import { DressDto } from "@nest/dress-module/dto/dress.dto";

export class GetAllAvailableForPeriodInputDto extends GetAllAvailableForPeriodInput {
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

export type GetAllAvailableForPeriodOutputDto = DressDto[];
