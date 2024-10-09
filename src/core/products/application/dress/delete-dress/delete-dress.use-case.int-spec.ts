import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { DeleteDressUseCase } from "@core/products/application/dress/delete-dress/delete-dress.use-case";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { DressId } from "@core/products/domain/dress/dress-id.vo";

class ImageStorageServiceMock implements IImageStorageService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async upload(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fileName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    file: Buffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mimetype: string,
  ): Promise<string> {
    return "images/image.jpg";
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(fileKey: string): Promise<void> {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPreSignedUrl(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fileKey: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expiresInSeconds: number,
  ): Promise<string> {
    return "https://image.com/images/image.jpg";
  }
}

describe("DeleteDressUseCase Integration Test", () => {
  let useCase: DeleteDressUseCase;
  let repository: IDressRepository;
  const uploadService: IImageStorageService = new ImageStorageServiceMock();

  const setup = setupTypeOrmForIntegrationTests({
    entities: [DressModel],
  });

  beforeEach(async () => {
    vi.restoreAllMocks();
    repository = new DressTypeormRepository(
      setup.dataSource.getRepository(DressModel),
    );
    useCase = new DeleteDressUseCase(repository, uploadService);
    const dress = new Dress({
      id: DressId.create("34862044-e627-4de8-8c0d-64ab9231a77b"),
      fabric: "fabric",
      model: "model",
      color: "red",
      rentPrice: 100,
      isPickedUp: false,
      imagePath: "images/image.jpg",
      reservationPeriods: [],
    });
    await repository.save(dress);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should delete a dress", async () => {
    const spy = vi.spyOn(uploadService, "delete");
    const input = {
      id: "34862044-e627-4de8-8c0d-64ab9231a77b",
    };
    await useCase.execute(input);
    const dress = await repository.findById(DressId.create(input.id));
    expect(dress).toBeNull();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith("images/image.jpg");
  });

  it("should not delete a dress with non existent id", async () => {
    const spy = vi.spyOn(uploadService, "delete");
    const input = {
      id: "34862044-e627-4de8-8c0d-64ab9231a77c",
    };
    await expect(useCase.execute(input)).rejects.toThrowError(
      "Dress with id(s) 34862044-e627-4de8-8c0d-64ab9231a77c not found",
    );
    expect(spy).toBeCalledTimes(0);
  });
});
