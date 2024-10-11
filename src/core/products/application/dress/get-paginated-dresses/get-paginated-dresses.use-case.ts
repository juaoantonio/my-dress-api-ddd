import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  DressSearchParams,
  IDressRepository,
} from "@core/products/domain/dress/dress.repository";
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsPositive,
} from "class-validator";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import {
  DressOutput,
  DressOutputMapper,
} from "@core/products/application/dress/common/dress.output-mapper";
import {
  PaginationOutput,
  PaginationOutputMapper,
} from "@core/@shared/application/pagination-output";
import { UrlPresignerService } from "@core/@shared/application/url-presigner.service";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";

export class GetPaginatedDressesUseCase
  implements
    IUseCase<
      GetPaginatedDressesUseCaseInput,
      Promise<GetPaginatedDressesUseCaseOutput>
    >
{
  readonly urlPresignerService: UrlPresignerService;

  constructor(
    private readonly dressRepository: IDressRepository,
    readonly imageStorageService: IImageStorageService,
  ) {
    this.urlPresignerService = new UrlPresignerService(imageStorageService);
  }

  async execute(
    input: GetPaginatedDressesUseCaseInput,
  ): Promise<GetPaginatedDressesUseCaseOutput> {
    const searchParams = DressSearchParams.create({
      page: input.page,
      perPage: input.limit,
      sortDir: "desc",
      filter: {
        available: input.available,
        startDate: input.startDate,
        endDate: input.endDate,
      },
    });
    const result = await this.dressRepository.search(searchParams);
    const dressesWithPreSignedUrl =
      await this.urlPresignerService.signMany<Dress>(
        result.items,
        "imagePath" as keyof Dress,
      );
    const dressesOutput = DressOutputMapper.toOutputMany(
      dressesWithPreSignedUrl,
    );

    return PaginationOutputMapper.toOutput(dressesOutput, result);
  }
}

export class GetPaginatedDressesUseCaseInput {
  @IsPositive()
  page: number;

  @IsPositive()
  limit: number;

  @IsOptional()
  @IsBoolean()
  available: boolean;

  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;
}

export type GetPaginatedDressesUseCaseOutput = PaginationOutput<DressOutput>;
