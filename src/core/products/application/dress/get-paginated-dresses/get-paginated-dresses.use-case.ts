import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  DressSearchParams,
  IDressRepository,
} from "@core/products/domain/dress/dress.repository";
import { IsPositive } from "class-validator";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { CommonPaginatedResponseOutput } from "@core/@shared/application/common-paginated-response.output";

export class GetPaginatedDressesUseCase
  implements
    IUseCase<
      GetPaginatedDressesUseCaseInput,
      Promise<GetPaginatedDressesUseCaseOutput>
    >
{
  constructor(
    private readonly dressRepository: IDressRepository,
    private readonly imageStorageService: IImageStorageService,
  ) {}

  async execute(
    input: GetPaginatedDressesUseCaseInput,
  ): Promise<GetPaginatedDressesUseCaseOutput> {
    const searchParams = DressSearchParams.create({
      page: input.page,
      perPage: input.limit,
      sortDir: "desc",
    });
    const result = await this.dressRepository.search(searchParams);
    const dresses: OutputDress[] = await Promise.all(
      result.items.map(async (dress) => {
        const imageUrl = await this.imageStorageService.getPreSignedUrl(
          dress.getImagePath(),
        );
        return {
          id: dress.getId().value,
          rentPrice: dress.getRentPrice(),
          name: dress.getName(),
          color: dress.getColor(),
          model: dress.getModel(),
          fabric: dress.getFabric(),
          isPickedUp: dress.getIsPickedUp(),
          imageUrl,
          type: dress.getType(),
        };
      }),
    );
    return {
      items: dresses,
      total: result.total,
      currentPage: result.currentPage,
      perPage: result.perPage,
      lastPage: result.lastPage,
    };
  }
}

export class GetPaginatedDressesUseCaseInput {
  @IsPositive()
  page: number;

  @IsPositive()
  limit: number;
}

export class OutputDress {
  id: string;
  rentPrice: number;
  name: string;
  color: string;
  model: string;
  fabric: string;
  isPickedUp: boolean;
  imageUrl: string;
  type: string;
}

export class GetPaginatedDressesUseCaseOutput extends CommonPaginatedResponseOutput<OutputDress> {
  declare items: OutputDress[];
  declare total: number;
  declare currentPage: number;
  declare perPage: number;
  declare lastPage: number;
}
