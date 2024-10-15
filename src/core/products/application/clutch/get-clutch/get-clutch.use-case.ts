import { IsUUID } from "class-validator";
import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  ClutchOutput,
  ClutchOutputMapper,
} from "@core/products/application/clutch/common/clutch.output-mapper";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { UrlPresignerService } from "@core/@shared/application/url-presigner.service";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";

export class GetClutchUseCase
  implements IUseCase<GetClutchUseCaseInput, Promise<ClutchOutput>>
{
  readonly urlPresignerService: UrlPresignerService;

  constructor(
    private readonly clutchRepository: IClutchRepository,
    private readonly imageStorageService: IImageStorageService,
  ) {
    this.urlPresignerService = new UrlPresignerService(imageStorageService);
  }

  async execute(input: GetClutchUseCaseInput): Promise<ClutchOutput> {
    const clutchId = ClutchId.create(input.id);
    const clutch = await this.clutchRepository.findById(clutchId);
    if (!clutch) throw new EntityNotFoundError(clutchId, Clutch);
    const outputClutch = ClutchOutputMapper.toOutput(clutch);
    return this.urlPresignerService.signOne(outputClutch, "imagePath");
  }
}

export class GetClutchUseCaseInput {
  @IsUUID()
  id: string;
}
