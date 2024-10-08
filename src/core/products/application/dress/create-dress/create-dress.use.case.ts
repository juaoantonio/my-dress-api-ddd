import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";

export class CreateDressUseCase
  implements IUseCase<CreateDressUseCaseInput, Promise<void>>
{
  constructor(
    private readonly dressRepository: IDressRepository,
    private readonly uploadService: IImageStorageService,
  ) {}

  async execute(input: CreateDressUseCaseInput): Promise<void> {
    const imageKey = await this.uploadService.upload(
      input.imageFileName,
      input.imageBody,
      input.imageMimetype,
    );
    const dress = Dress.create({
      imagePath: imageKey,
      rentPrice: input.rentPrice,
      color: input.color,
      model: input.model,
      fabric: input.fabric,
    });
    if (dress.notification.hasErrors()) {
      await this.uploadService.delete(imageKey);
      throw new EntityValidationError(dress.notification.toJSON());
    }
    await this.dressRepository.save(dress);
  }
}

export class CreateDressUseCaseInput {
  imageBody: Buffer;

  @IsNotEmpty()
  @IsString()
  imageMimetype: string;

  @IsNotEmpty()
  @IsString()
  imageFileName: string;

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
