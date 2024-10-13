import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";
import { ImageFile } from "@nest/shared-module/decorators/uploaded-image-file.decorator";

export class CreateDressUseCase
  implements IUseCase<CreateDressUseCaseInput, Promise<void>>
{
  constructor(
    private readonly dressRepository: IDressRepository,
    private readonly imageStorageService: IImageStorageService,
  ) {}

  async execute(input: CreateDressUseCaseInput): Promise<void> {
    const imageKey = await this.imageStorageService.upload(
      input.image.originalname,
      input.image.buffer,
      input.image.mimetype,
    );
    const dress = Dress.create({
      imagePath: imageKey,
      rentPrice: input.rentPrice,
      color: input.color,
      model: input.model,
      fabric: input.fabric,
    });
    if (dress.notification.hasErrors()) {
      await this.imageStorageService.delete(imageKey);
      throw new EntityValidationError(dress.notification.toJSON());
    }
    await this.dressRepository.save(dress);
  }
}

export class CreateDressUseCaseInput {
  @IsNotEmpty()
  image: ImageFile;

  @IsPositive()
  rentPrice: number;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  fabric: string;
}
