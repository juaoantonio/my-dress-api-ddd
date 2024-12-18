import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  ClutchSearchParams,
  IClutchRepository,
} from "@core/products/domain/clutch/clutch.repository";
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsPositive,
  IsUUID,
} from "class-validator";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import {
  ClutchOutput,
  ClutchOutputMapper,
} from "@core/products/application/clutch/common/clutch.output-mapper";
import {
  PaginationOutput,
  PaginationOutputMapper,
} from "@core/@shared/application/pagination-output";
import { UrlPresignerService } from "@core/@shared/application/url-presigner.service";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";

export class GetPaginatedClutchesUseCase
  implements
    IUseCase<
      GetPaginatedClutchesUseCaseInput,
      Promise<GetPaginatedClutchesUseCaseOutput>
    >
{
  readonly urlPresignerService: UrlPresignerService;

  constructor(
    private readonly clutchRepository: IClutchRepository,
    readonly imageStorageService: IImageStorageService,
  ) {
    this.urlPresignerService = new UrlPresignerService(imageStorageService);
  }

  async execute(
    input: GetPaginatedClutchesUseCaseInput,
  ): Promise<GetPaginatedClutchesUseCaseOutput> {
    const searchParams = ClutchSearchParams.create({
      page: input.page,
      perPage: input.limit,
      sortDir: "desc",
      filter: {
        name: input.name,
        color: input.color,
        model: input.model,
        rentPrice: input.rentPrice,
        available: input.available,
        startDate: input.startDate,
        endDate: input.endDate,
        bookingId: input.bookingId,
      },
    });
    const result = await this.clutchRepository.search(searchParams);
    const clutchesWithPreSignedUrl =
      await this.urlPresignerService.signMany<Clutch>(
        result.items,
        "imagePath" as keyof Clutch,
      );
    const clutchesOutput = ClutchOutputMapper.toOutputMany(
      clutchesWithPreSignedUrl,
    );

    return PaginationOutputMapper.toOutput(clutchesOutput, result);
  }
}

export class GetPaginatedClutchesUseCaseInput {
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
  color?: string;

  @IsOptional()
  rentPrice?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsUUID()
  @IsOptional()
  bookingId?: string;
}

export type GetPaginatedClutchesUseCaseOutput = PaginationOutput<ClutchOutput>;
