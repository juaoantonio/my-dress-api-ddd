import { IsNotEmpty, IsPositive, IsString } from "class-validator";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { ImageFile } from "@nest/shared-module/decorators/uploaded-image-file.decorator";

export class CreateClutchUseCase
  implements IUseCase<CreateClutchUseCaseInput, Promise<void>>
{
  constructor(
    private readonly clutchRepository: IClutchRepository,
    private readonly imageStorageService: IImageStorageService,
  ) {}

  async execute(input: CreateClutchUseCaseInput): Promise<void> {
    const imageKey = await this.imageStorageService.upload(
      input.image.originalname,
      input.image.buffer,
      input.image.mimetype,
    );
    const clutch = Clutch.create({
      imagePath: imageKey,
      rentPrice: input.rentPrice,
      color: input.color,
      model: input.model,
    });
    if (clutch.notification.hasErrors()) {
      await this.imageStorageService.delete(imageKey);
      throw new EntityValidationError(clutch.notification.toJSON());
    }
    await this.clutchRepository.save(clutch);
  }
}

export class CreateClutchUseCaseInput {
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
}
