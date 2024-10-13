import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { ClutchTypeormRepository } from "@core/products/infra/db/typeorm/clutch/clutch.typeorm-repository";
import { ImageStorageServiceMock } from "@core/@shared/infra/testing/image-storage-mock";
import { GetClutchUseCase } from "@core/products/application/clutch/get-clutch/get-clutch.use-case";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { it } from "vitest";

describe("GetClutchUseCase Integration Test", () => {
  let useCase: GetClutchUseCase;
  let repository: IClutchRepository;
  const uploadService: IImageStorageService = new ImageStorageServiceMock();

  const setup = setupTypeOrmForIntegrationTests({
    entities: [ClutchModel],
  });

  beforeEach(async () => {
    vi.restoreAllMocks();
    repository = new ClutchTypeormRepository(
      setup.dataSource.getRepository(ClutchModel),
    );
    useCase = new GetClutchUseCase(repository, uploadService);
    const clutch = Clutch.fake()
      .aClutch()
      .withId(ClutchId.create("7eba2077-255d-49a3-9e0b-c1f8e118369f"))
      .withColor("Prata")
      .withModel("Sem alça")
      .withImagePath("image/image.jpg")
      .build();
    await repository.save(clutch);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should get a clutch", async () => {
    vi.spyOn(uploadService, "getPreSignedUrl").mockResolvedValue(
      "https://image-storage.com/image/image.jpg",
    );
    const clutch = await useCase.execute({
      id: "7eba2077-255d-49a3-9e0b-c1f8e118369f",
    });
    expect(clutch).toBeDefined();
    expect(clutch.id).toBe("7eba2077-255d-49a3-9e0b-c1f8e118369f");
    expect(clutch.color).toBe("Prata");
    expect(clutch.model).toBe("Sem alça");
    expect(clutch.imagePath).toBe("https://image-storage.com/image/image.jpg");
  });

  it("should throw an error when the clutch does not exist", async () => {
    await expect(
      useCase.execute({
        id: "7eba2077-255d-49a3-9e0b-c1f8e118369e",
      }),
    ).rejects.toThrowError(
      "Clutch with id(s) 7eba2077-255d-49a3-9e0b-c1f8e118369e not found",
    );
  });
});
