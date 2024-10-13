import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { ImageStorageServiceMock } from "@core/@shared/infra/testing/image-storage-mock";
import { GetDressUseCase } from "@core/products/application/dress/get-dress/get-dress.use-case";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { it } from "vitest";

describe("GetDressUseCase Integration Test", () => {
  let useCase: GetDressUseCase;
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
    useCase = new GetDressUseCase(repository, uploadService);
    const dress = Dress.fake()
      .aDress()
      .withId(DressId.create("7eba2077-255d-49a3-9e0b-c1f8e118369f"))
      .withColor("Turquesa")
      .withModel("Tomara que caia")
      .withFabric("Seda")
      .withImagePath("image/image.jpg")
      .build();
    await repository.save(dress);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should get a dress", async () => {
    vi.spyOn(uploadService, "getPreSignedUrl").mockResolvedValue(
      "https://image-storage.com/image/image.jpg",
    );
    const dress = await useCase.execute({
      id: "7eba2077-255d-49a3-9e0b-c1f8e118369f",
    });
    expect(dress).toBeDefined();
    expect(dress.id).toBe("7eba2077-255d-49a3-9e0b-c1f8e118369f");
    expect(dress.color).toBe("Turquesa");
    expect(dress.model).toBe("Tomara que caia");
    expect(dress.fabric).toBe("Seda");
    expect(dress.imagePath).toBe("https://image-storage.com/image/image.jpg");
  });

  it("should throw an error when the dress does not exist", async () => {
    await expect(
      useCase.execute({
        id: "7eba2077-255d-49a3-9e0b-c1f8e118369e",
      }),
    ).rejects.toThrowError(
      "Dress with id(s) 7eba2077-255d-49a3-9e0b-c1f8e118369e not found",
    );
  });
});
