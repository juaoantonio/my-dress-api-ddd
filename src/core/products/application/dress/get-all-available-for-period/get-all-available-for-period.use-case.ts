import { IsDateString } from "class-validator";
import {
  DressOutput,
  DressOutputMapper,
} from "@core/products/application/dress/common/dress.output-mapper";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { UrlPresignerService } from "@core/@shared/application/url-presigner.service";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";

export class GetAllAvailableForPeriodUseCase
  implements
    IUseCase<
      GetAllAvailableForPeriodInput,
      Promise<GetAllAvailableForPeriodOutput>
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
    input: GetAllAvailableForPeriodInput,
  ): Promise<GetAllAvailableForPeriodOutput> {
    const availableDresses =
      await this.dressRepository.getAllAvailableForPeriod(
        new Period({
          startDate: DateVo.create(input.startDate),
          endDate: DateVo.create(input.endDate),
        }),
      );
    const dressesWithPreSignedUrl =
      await this.urlPresignerService.signMany<Dress>(
        availableDresses,
        "imagePath" as keyof Dress,
      );
    return DressOutputMapper.toOutputMany(dressesWithPreSignedUrl);
  }
}

export class GetAllAvailableForPeriodInput {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export type GetAllAvailableForPeriodOutput = DressOutput[];
