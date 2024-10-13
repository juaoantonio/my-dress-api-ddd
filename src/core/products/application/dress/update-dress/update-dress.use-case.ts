import { PartialType } from "@nestjs/swagger";
import { CreateDressUseCaseInput } from "@core/products/application/dress/create-dress/create-dress.use.case";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { IsUUID } from "class-validator";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";

export class UpdateDressUseCase
  implements IUseCase<UpdateDressUseCaseInput, Promise<void>>
{
  constructor(
    private readonly dressRepository: IDressRepository,
    private readonly imageStorageService: IImageStorageService,
  ) {}

  async execute(input: UpdateDressUseCaseInput): Promise<void> {
    const dressId = DressId.create(input.id);
    const dress = await this.dressRepository.findById(dressId);
    if (!dress) {
      throw new EntityNotFoundError(dressId, Dress);
    }
    if (input.image) {
      const imageKey = await this.imageStorageService.upload(
        input.image.originalname,
        input.image.buffer,
        input.image.mimetype,
      );
      dress.changeImagePath(imageKey);
    }
    if (input.rentPrice) dress.changeRentPrice(input.rentPrice);
    if (input.color) dress.changeColor(input.color);
    if (input.model) dress.changeModel(input.model);
    if (input.fabric) dress.changeFabric(input.fabric);
    if (dress.notification.hasErrors())
      throw new EntityValidationError(dress.notification.toJSON());
    await this.dressRepository.update(dress);
  }
}

export class UpdateDressUseCaseInput extends PartialType(
  CreateDressUseCaseInput,
) {
  @IsUUID()
  id: string;
}
