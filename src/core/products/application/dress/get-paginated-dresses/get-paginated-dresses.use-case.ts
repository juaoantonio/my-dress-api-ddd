import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  DressSearchParams,
  IDressRepository,
} from "@core/products/domain/dress/dress.repository";
import { IsPositive } from "class-validator";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";

export class GetPaginatedDressesUseCase
  implements
    IUseCase<
      GetPaginatedDressesUseCaseInput,
      Promise<GetPaginatedDressesUseCaseOutput[]>
    >
{
  constructor(
    private readonly dressRepository: IDressRepository,
    private readonly imageStorageService: IImageStorageService,
  ) {}

  async execute(
    input: GetPaginatedDressesUseCaseInput,
  ): Promise<GetPaginatedDressesUseCaseOutput[]> {
    const searchParams = DressSearchParams.create({
      page: input.page,
      per_page: input.limit,
      sort_dir: "desc",
    });
    const result = await this.dressRepository.search(searchParams);
    const presentation = result.items.map(async (dress) => {
      const imageUrl = await this.imageStorageService.getPreSignedUrl(
        dress.getImagePath(),
      );
      return {
        id: dress.getId().value,
        rent: dress.getRentPrice(),
        name: dress.getName(),
        color: dress.getColor(),
        model: dress.getModel(),
        fabric: dress.getFabric(),
        isPickedUp: dress.getIsPickedUp(),
        imageUrl: imageUrl,
        type: "dress",
      };
    });
    return Promise.all(presentation);
  }
}

export class GetPaginatedDressesUseCaseInput {
  @IsPositive()
  page: number;

  @IsPositive()
  limit: number;
}

export class GetPaginatedDressesUseCaseOutput {
  id: string;
  rent: number;
  name: string;
  color: string;
  model: string;
  fabric: string;
  isPickedUp: boolean;
  imageUrl: string;
  type: string;
}
