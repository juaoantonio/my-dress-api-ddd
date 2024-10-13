import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import {
  UpdateClutchUseCase,
  UpdateClutchUseCaseInput,
} from "@core/products/application/clutch/update-clutch/update-clutch.use-case";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { ClutchTypeormRepository } from "@core/products/infra/db/typeorm/clutch/clutch.typeorm-repository";
import { ImageStorageServiceMock } from "@core/@shared/infra/testing/image-storage-mock";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { it } from "vitest";
import { ImageMockBuilder } from "@core/@shared/infra/testing/mocks/file";

describe("UpdateClutchUseCase Integration Test", () => {
  const setup = setupTypeOrmForIntegrationTests({
    entities: [ClutchModel],
  });
  let clutchRepository: IClutchRepository;
  let updateClutchUseCase: UpdateClutchUseCase;

  beforeEach(async () => {
    clutchRepository = new ClutchTypeormRepository(
      setup.dataSource.getRepository(ClutchModel),
    );
    updateClutchUseCase = new UpdateClutchUseCase(
      clutchRepository,
      new ImageStorageServiceMock(),
    );
    const clutche = Clutch.fake()
      .aClutch()
      .withId(ClutchId.create("fd9f1084-a992-427b-9fb4-d113b96c8e00"))
      .withColor("Prata")
      .withModel("Com alça")
      .withRentPrice(100)
      .build();
    await clutchRepository.save(clutche);
  });

  it("should be defined", () => {
    expect(updateClutchUseCase).toBeDefined();
  });

  describe("valid inputs", () => {
    const inputs: UpdateClutchUseCaseInput[] = [
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
        color: "Dourada",
        model: "Com alça",
        rentPrice: 50,
        image: new ImageMockBuilder().build(),
      },
    ];
    test.each(inputs)("should update clutch with input: %o", async (input) => {
      await updateClutchUseCase.execute(input);
      const clutch = await clutchRepository.findById(ClutchId.create(input.id));
      expect(clutch).toBeDefined();
      expect(clutch.getColor()).toBe(input.color ?? "Prata");
      expect(clutch.getModel()).toBe(input.model ?? "Com alça");
      expect(clutch.getRentPrice()).toBe(input.rentPrice ?? 100);
    });
  });

  describe("invalid inputs", () => {
    const invalidInputs: UpdateClutchUseCaseInput[] = [
      {
        id: "fd9f1084-a992-427b-9fb4-d113b96c8e00",
        rentPrice: -50,
      },
    ];

    test.each(invalidInputs)(
      "should not update clutch with input: %o",
      async (input) => {
        expect(updateClutchUseCase.execute(input)).rejects.toThrowError(
          "Entidade inválida",
        );
      },
    );

    it("should throw an error when clutch does not exist", async () => {
      const input: UpdateClutchUseCaseInput = {
        id: "fd9f1084-a992-427b-9fb4-d113b96c8e01",
      };
      expect(updateClutchUseCase.execute(input)).rejects.toThrowError(
        "Clutch with id(s) fd9f1084-a992-427b-9fb4-d113b96c8e01 not found",
      );
    });
  });
});
