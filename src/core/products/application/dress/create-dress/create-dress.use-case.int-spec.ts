import { CreateDressUseCase } from "@core/products/application/dress/create-dress/create-dress.use.case";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { ImageUploadError } from "@core/@shared/infra/errors/image-upload.error";

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

describe("CreateDressUseCase Integration Test", () => {
  let useCase: CreateDressUseCase;
  let repository: IDressRepository;
  const uploadService: IImageStorageService = new ImageStorageServiceMock();

  const setup = setupTypeOrmForIntegrationTests({
    entities: [DressModel],
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    repository = new DressTypeormRepository(
      setup.dataSource.getRepository(DressModel),
    );
    useCase = new CreateDressUseCase(repository, uploadService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should create a dress", async () => {
    const input = {
      imageFileName: "image.jpg",
      imageMimetype: "image/jpeg",
      imageBody: Buffer.from("image"),
      rentPrice: 100,
      color: "blue",
      model: "model",
      fabric: "fabric",
    };
    await useCase.execute(input);
    const dresses = await repository.findMany();
    expect(dresses).toHaveLength(1);
    const dress = dresses[0];
    expect(dress.getImagePath()).toBe("images/image.jpg");
    expect(dress.getRentPrice()).toBe(100);
    expect(dress.getColor()).toBe("blue");
    expect(dress.getModel()).toBe("model");
    expect(dress.getFabric()).toBe("fabric");
    expect(dress.getId().getValue()).toBeDefined();
    expect(dress.getType()).toBe("dress");
  });

  it("should not create a dress with invalid input", async () => {
    const input = {
      imageFileName: "image.jpg",
      imageMimetype: "image/jpeg",
      imageBody: Buffer.from("image"),
      rentPrice: -100,
      color: "",
      model: "",
      fabric: "",
    };
    await expect(useCase.execute(input)).rejects.toThrow("Entidade inválida");
  });

  it("should not create a dress if the file was not uploaded", async () => {
    vi.spyOn(uploadService, "upload").mockImplementation(() => {
      throw new ImageUploadError();
    });
    const input = {
      imageFileName: "image.jpg",
      imageMimetype: "image/jpeg",
      imageBody: Buffer.from("image"),
      rentPrice: 100,
      color: "blue",
      model: "model",
      fabric: "fabric",
    };
    await expect(useCase.execute(input)).rejects.toThrow(
      "Falha ao fazer upload da imagem",
    );
    const dresses = await repository.findMany();
    expect(dresses).toHaveLength(0);
  });
});
