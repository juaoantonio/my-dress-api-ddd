import { IsDateString } from "class-validator";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  DressOutput,
  DressOutputMapper,
} from "@core/products/application/dress/common/dress.output-mapper";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { UrlPresignerService } from "@core/@shared/application/url-presigner.service";

export class GetAllNotAvailableForPeriodUseCase
  implements
    IUseCase<
      GetAllNotAvailableForPeriodInput,
      Promise<GetAllNotAvailableForPeriodOutput>
    >
{
  constructor(
    private readonly dressRepository: IDressRepository,
    imageStorageService: IImageStorageService,
    private readonly urlPresignerService: UrlPresignerService = new UrlPresignerService(
      imageStorageService,
    ),
  ) {}

  async execute(
    input: GetAllNotAvailableForPeriodInput,
  ): Promise<GetAllNotAvailableForPeriodOutput> {
    const notAvailableDresses =
      await this.dressRepository.getAllNotAvailableForPeriod(
        Period.create({
          startDate: DateVo.create(input.startDate),
          endDate: DateVo.create(input.endDate),
        }),
      );
    const dressesWithPreSignedUrl =
      await this.urlPresignerService.signMany<Dress>(
        notAvailableDresses,
        "imagePath" as keyof Dress,
      );
    return DressOutputMapper.toOutputMany(dressesWithPreSignedUrl);
  }
}

export class GetAllNotAvailableForPeriodInput {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export type GetAllNotAvailableForPeriodOutput = DressOutput[];
