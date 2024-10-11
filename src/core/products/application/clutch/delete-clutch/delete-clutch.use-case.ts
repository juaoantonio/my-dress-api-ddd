import { IsUUID } from "class-validator";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";

export class DeleteClutchUseCase
  implements IUseCase<DeleteClutchUseCaseInput, Promise<void>>
{
  constructor(
    private readonly clutchRepository: IClutchRepository,
    private readonly imageStorageService: IImageStorageService,
  ) {}

  async execute(input: DeleteClutchUseCaseInput): Promise<void> {
    const clutchId = ClutchId.create(input.id);
    const clutch = await this.clutchRepository.findById(clutchId);
    await this.clutchRepository.delete(clutchId);
    await this.imageStorageService.delete(clutch.getImagePath());
  }
}

export class DeleteClutchUseCaseInput {
  @IsUUID("4", {
    message: "O id deve ser um UUID versão 4",
  })
  id: string;
}
