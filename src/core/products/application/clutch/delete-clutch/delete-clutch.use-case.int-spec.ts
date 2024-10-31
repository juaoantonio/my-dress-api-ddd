import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { DeleteClutchUseCase } from "@core/products/application/clutch/delete-clutch/delete-clutch.use-case";
import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { ImageStorageServiceMock } from "@core/@shared/infra/testing/image-storage-mock";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { ClutchTypeormRepository } from "@core/products/infra/db/typeorm/clutch/clutch.typeorm-repository";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { BookingItemClutchModel } from "@core/booking/infra/db/typeorm/booking-item-clutch.model";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { BookingItemDressModel } from "@core/booking/infra/db/typeorm/booking-item-dress.model";

describe("DeleteClutchUseCase Integration Test", () => {
  let useCase: DeleteClutchUseCase;
  let repository: IClutchRepository;
  const uploadService: IImageStorageService = new ImageStorageServiceMock();

  const setup = setupTypeOrmForIntegrationTests({
    entities: [
      BookingModel,
      DressModel,
      BookingItemDressModel,
      ClutchModel,
      BookingItemClutchModel,
    ],
  });

  beforeEach(async () => {
    vi.restoreAllMocks();
    repository = new ClutchTypeormRepository(
      setup.dataSource.getRepository(ClutchModel),
    );
    useCase = new DeleteClutchUseCase(repository, uploadService);
    const clutch = new Clutch({
      id: ClutchId.create("34862044-e627-4de8-8c0d-64ab9231a77b"),
      model: "model",
      color: "red",
      rentPrice: 100,
      isPickedUp: false,
      imagePath: "images/image.jpg",
      reservationPeriods: [],
    });
    await repository.save(clutch);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should delete a clutch", async () => {
    const spy = vi.spyOn(uploadService, "delete");
    const input = {
      id: "34862044-e627-4de8-8c0d-64ab9231a77b",
    };
    await useCase.execute(input);
    const clutch = await repository.findById(ClutchId.create(input.id));
    expect(clutch).toBeNull();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith("images/image.jpg");
  });

  it("should not delete a clutch with non existent id", async () => {
    const spy = vi.spyOn(uploadService, "delete");
    const input = {
      id: "34862044-e627-4de8-8c0d-64ab9231a77c",
    };
    await expect(useCase.execute(input)).rejects.toThrowError(
      "Clutch with id(s) 34862044-e627-4de8-8c0d-64ab9231a77c not found",
    );
    expect(spy).toBeCalledTimes(0);
  });
});
