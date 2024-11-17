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
  IsUUID,
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
        name: input.name,
        color: input.color,
        fabric: input.fabric,
        model: input.model,
        rentPrice: input.rentPrice,
        available: input.available,
        startDate: input.startDate,
        endDate: input.endDate,
        bookingId: input.bookingId,
      },
    });
    const result = await this.dressRepository.search(searchParams);
    const dressesOutput = DressOutputMapper.toOutputMany(result.items);
    const dressesWithPreSignedUrl = await this.urlPresignerService.signMany(
      dressesOutput,
      "imagePath",
    );
    return PaginationOutputMapper.toOutput(dressesWithPreSignedUrl, result);
  }
}

export class GetPaginatedDressesUseCaseInput {
  @IsPositive()
  @IsOptional()
  page?: number;

  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  model?: string;

  @IsOptional()
  fabric?: string;

  @IsOptional()
  color?: string;

  @IsPositive()
  @IsOptional()
  rentPrice?: number;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsUUID()
  @IsOptional()
  bookingId?: string;
}

export type GetPaginatedDressesUseCaseOutput = PaginationOutput<DressOutput>;
