import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IsUUID } from "class-validator";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";

export class DeleteDressUseCase
  implements IUseCase<DeleteDressUseCaseInput, void>
{
  constructor(
    private readonly dressRepository: IDressRepository,
    private readonly imageStorageService: IImageStorageService,
  ) {}

  async execute(input: DeleteDressUseCaseInput): Promise<void> {
    const dressId = DressId.create(input.id);
    const dress = await this.dressRepository.findById(dressId);
    await this.dressRepository.delete(dressId);
    await this.imageStorageService.delete(dress.getImagePath());
  }
}

export class DeleteDressUseCaseInput {
  @IsUUID("4", {
    message: "O id deve ser um UUID versão 4",
  })
  id: string;
}
