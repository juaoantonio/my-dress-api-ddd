import { CreateClutchUseCase } from "@core/products/application/clutch/create-clutch/create-clutch.use.case";
import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { ImageStorageServiceMock } from "@core/@shared/infra/testing/image-storage-mock";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { ClutchTypeormRepository } from "@core/products/infra/db/typeorm/clutch/clutch.typeorm-repository";
import { ImageUploadError } from "@core/@shared/infra/errors/image-upload.error";
import { ImageMockBuilder } from "@core/@shared/infra/testing/mocks/file";

describe("CreateClutchUseCase Integration Test", () => {
  let useCase: CreateClutchUseCase;
  let repository: IClutchRepository;
  const uploadService: IImageStorageService = new ImageStorageServiceMock();

  const setup = setupTypeOrmForIntegrationTests({
    entities: [ClutchModel],
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    repository = new ClutchTypeormRepository(
      setup.dataSource.getRepository(ClutchModel),
    );
    useCase = new CreateClutchUseCase(repository, uploadService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should create a clutch", async () => {
    const input = {
      image: new ImageMockBuilder().build(),
      rentPrice: 100,
      color: "blue",
      model: "model",
    };
    await useCase.execute(input);
    const clutches = await repository.findMany();
    expect(clutches).toHaveLength(1);
    const clutch = clutches[0];
    expect(clutch.getImagePath()).toBe("images/image.jpg");
    expect(clutch.getRentPrice()).toBe(100);
    expect(clutch.getColor()).toBe("blue");
    expect(clutch.getModel()).toBe("model");
    expect(clutch.getId().getValue()).toBeDefined();
    expect(clutch.getType()).toBe("clutch");
  });

  it("should not create a clutch with invalid input", async () => {
    const input = {
      image: new ImageMockBuilder().build(),
      rentPrice: -100,
      color: "",
      model: "",
    };
    await expect(useCase.execute(input)).rejects.toThrow("Entidade inválida");
  });

  it("should not create a clutch if the file was not uploaded", async () => {
    vi.spyOn(uploadService, "upload").mockImplementation(() => {
      throw new ImageUploadError();
    });
    const input = {
      image: new ImageMockBuilder().build(),
      rentPrice: 100,
      color: "blue",
      model: "model",
    };
    await expect(useCase.execute(input)).rejects.toThrow(
      "Falha ao fazer upload da imagem",
    );
    const clutches = await repository.findMany();
    expect(clutches).toHaveLength(0);
  });
});
