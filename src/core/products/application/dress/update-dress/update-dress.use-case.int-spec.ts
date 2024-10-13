import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import {
  UpdateDressUseCase,
  UpdateDressUseCaseInput,
} from "@core/products/application/dress/update-dress/update-dress.use-case";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { ImageStorageServiceMock } from "@core/@shared/infra/testing/image-storage-mock";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { it } from "vitest";
import { ImageMockBuilder } from "@core/@shared/infra/testing/mocks/file";

describe("UpdateDressUseCase Integration Test", () => {
  const setup = setupTypeOrmForIntegrationTests({
    entities: [DressModel],
  });
  let dressRepository: IDressRepository;
  let updateDressUseCase: UpdateDressUseCase;

  beforeEach(async () => {
    dressRepository = new DressTypeormRepository(
      setup.dataSource.getRepository(DressModel),
    );
    updateDressUseCase = new UpdateDressUseCase(
      dressRepository,
      new ImageStorageServiceMock(),
    );
    const dress = Dress.fake()
      .aDress()
      .withId(DressId.create("fd9f1084-a992-427b-9fb4-d113b96c8e00"))
      .withColor("Turquesa")
      .withModel("Decote em V")
      .withFabric("Algodão")
      .withRentPrice(100)
      .build();
    await dressRepository.save(dress);
  });

  it("should be defined", () => {
    expect(updateDressUseCase).toBeDefined();
  });

  describe("valid inputs", () => {
    const inputs: UpdateDressUseCaseInput[] = [
      {
        id: "fd9f1084-a992-427b-9fb4-d113b96c8e00",
        color: "Dourada",
      },
      {
        id: "fd9f1084-a992-427b-9fb4-d113b96c8e00",
        model: "Sem alça",
      },
      {
        id: "fd9f1084-a992-427b-9fb4-d113b96c8e00",
        rentPrice: 50,
      },
      {
        id: "fd9f1084-a992-427b-9fb4-d113b96c8e00",
        fabric: "Seda",
      },
      {
        id: "fd9f1084-a992-427b-9fb4-d113b96c8e00",
        color: "Dourada",
        model: "Com alça",
        rentPrice: 50,
        image: new ImageMockBuilder().build(),
      },
    ];
    test.each(inputs)("should update dress with input: %o", async (input) => {
      await updateDressUseCase.execute(input);
      const dress = await dressRepository.findById(DressId.create(input.id));
      expect(dress).toBeDefined();
      expect(dress.getColor()).toBe(input.color ?? "Turquesa");
      expect(dress.getModel()).toBe(input.model ?? "Decote em V");
      expect(dress.getFabric()).toBe(input.fabric ?? "Algodão");
      expect(dress.getRentPrice()).toBe(input.rentPrice ?? 100);
    });
  });

  describe("invalid inputs", () => {
    const invalidInputs: UpdateDressUseCaseInput[] = [
      {
        id: "fd9f1084-a992-427b-9fb4-d113b96c8e00",
        rentPrice: -50,
      },
    ];

    test.each(invalidInputs)(
      "should not update dress with input: %o",
      async (input) => {
        expect(updateDressUseCase.execute(input)).rejects.toThrowError(
          "Entidade inválida",
        );
      },
    );

    it("should throw an error when dress does not exist", async () => {
      const input: UpdateDressUseCaseInput = {
        id: "fd9f1084-a992-427b-9fb4-d113b96c8e01",
      };
      expect(updateDressUseCase.execute(input)).rejects.toThrowError(
        "Dress with id(s) fd9f1084-a992-427b-9fb4-d113b96c8e01 not found",
      );
    });
  });
});
