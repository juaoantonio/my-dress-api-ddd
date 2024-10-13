import { IsUUID } from "class-validator";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  DressOutput,
  DressOutputMapper,
} from "@core/products/application/dress/common/dress.output-mapper";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { UrlPresignerService } from "@core/@shared/application/url-presigner.service";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";

export class GetDressUseCase
  implements IUseCase<GetDressUseCaseInput, Promise<DressOutput>>
{
  readonly urlPresignerService: UrlPresignerService;

  constructor(
    private readonly dressRepository: IDressRepository,
    private readonly imageStorageService: IImageStorageService,
  ) {
    this.urlPresignerService = new UrlPresignerService(imageStorageService);
  }

  async execute(input: GetDressUseCaseInput): Promise<DressOutput> {
    const dressId = DressId.create(input.id);
    const dress = await this.dressRepository.findById(dressId);
    if (!dress) throw new EntityNotFoundError(dressId, Dress);
    const outputDress = DressOutputMapper.toOutput(dress);
    return this.urlPresignerService.signOne(outputDress, "imagePath");
  }
}

export class GetDressUseCaseInput {
  @IsUUID()
  id: string;
}
