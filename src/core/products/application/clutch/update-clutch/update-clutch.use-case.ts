import { PartialType } from "@nestjs/swagger";
import { CreateClutchUseCaseInput } from "@core/products/application/clutch/create-clutch/create-clutch.use.case";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { IsUUID } from "class-validator";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";

export class UpdateClutchUseCase
  implements IUseCase<UpdateClutchUseCaseInput, Promise<void>>
{
  constructor(
    private readonly clutchRepository: IClutchRepository,
    private readonly imageStorageService: IImageStorageService,
  ) {}

  async execute(input: UpdateClutchUseCaseInput): Promise<void> {
    const clutchId = ClutchId.create(input.id);
    const clutch = await this.clutchRepository.findById(clutchId);
    if (!clutch) {
      throw new EntityNotFoundError(clutchId, Clutch);
    }
    if (input.image) {
      const imageKey = await this.imageStorageService.upload(
        input.image.originalname,
        input.image.buffer,
        input.image.mimetype,
      );
      clutch.changeImagePath(imageKey);
    }
    if (input.rentPrice) {
      clutch.changeRentPrice(input.rentPrice);
    }
    if (input.color) {
      clutch.changeColor(input.color);
    }
    if (input.model) {
      clutch.changeModel(input.model);
    }
    if (clutch.notification.hasErrors())
      throw new EntityValidationError(clutch.notification.toJSON());
    await this.clutchRepository.update(clutch);
  }
}

export class UpdateClutchUseCaseInput extends PartialType(
  CreateClutchUseCaseInput,
) {
  @IsUUID()
  id: string;
}
