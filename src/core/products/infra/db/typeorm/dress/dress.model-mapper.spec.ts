import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { v4 as uuidv4 } from "uuid";
import { DressModelMapper } from "@core/products/infra/db/typeorm/dress/dress.model-mapper";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";

describe("DressModelMapper", () => {
  let mapper: DressModelMapper;

  beforeEach(() => {
    mapper = new DressModelMapper();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-10-01T00:00:00Z"));
  });

  describe("toEntity", () => {
    it("should map DressModel to Dress entity correctly without optional fields", () => {
      const dressModel = new DressModel();
      dressModel.id = uuidv4();
      dressModel.imageUrl = "https://example.com/image.png";
      dressModel.model = "Evening Dress";
      dressModel.color = "Red";
      dressModel.fabric = "Silk";
      dressModel.rentPrice = 200.0;
      dressModel.isPickedUp = false;
      dressModel.reservationPeriods = [];
      const dress = mapper.toEntity(dressModel);
      expect(dress).toBeInstanceOf(Dress);
      expect(dress.getId().getValue()).toBe(dressModel.id);
      expect(dress.getImageUrl()).toBe("https://example.com/image.png");
      expect(dress.getModel()).toBe("Evening Dress");
      expect(dress.getColor()).toBe("Red");
      expect(dress.getFabric()).toBe("Silk");
      expect(dress.getRentPrice()).toBe(200.0);
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getReservationPeriods()).toHaveLength(0);
    });

    it("should map DressModel to Dress entity correctly with all fields", () => {
      const dressModel = new DressModel();
      dressModel.id = uuidv4();
      dressModel.imageUrl = "https://example.com/image.png";
      dressModel.model = "Evening Dress";
      dressModel.color = "Red";
      dressModel.fabric = "Silk";
      dressModel.rentPrice = 200.0;
      dressModel.isPickedUp = false;
      dressModel.reservationPeriods = [
        {
          startDate: "2024-10-01T00:00:00.000Z",
          endDate: "2024-10-10T00:00:00.000Z",
        },
      ];
      const dress = mapper.toEntity(dressModel);
      expect(dress).toBeInstanceOf(Dress);
      expect(dress.getReservationPeriods()).toHaveLength(1);
      const period = dress.getReservationPeriods()[0];
      expect(period.getStartDate().getValue()).toEqual(
        new Date("2024-10-01T00:00:00.000Z"),
      );
      expect(period.getEndDate().getValue()).toEqual(
        new Date("2024-10-10T00:00:00.000Z"),
      );
    });
  });

  describe("toModel", () => {
    it("should map Dress entity to DressModel correctly without optional fields", () => {
      // Arrange
      const dress = new Dress({
        id: ClutchId.create(uuidv4()),
        imageUrl: "https://example.com/image.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });
      const dressModel = mapper.toModel(dress);
      expect(dressModel).toBeInstanceOf(DressModel);
      expect(dressModel.id).toBe(dress.getId().getValue());
      expect(dressModel.imageUrl).toBe(dress.getImageUrl());
      expect(dressModel.model).toBe(dress.getModel());
      expect(dressModel.color).toBe(dress.getColor());
      expect(dressModel.fabric).toBe(dress.getFabric());
      expect(dressModel.rentPrice).toBe(dress.getRentPrice());
      expect(dressModel.isPickedUp).toBe(false);
      expect(dressModel.reservationPeriods).toHaveLength(0);
    });

    it("should map Dress entity to DressModel correctly with all fields", () => {
      const dress = new Dress({
        id: ClutchId.create(uuidv4()),
        imageUrl: "https://example.com/image.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          new Period({
            startDate: DateVo.create(new Date("2024-10-01T00:00:00.000Z")),
            endDate: DateVo.create(new Date("2024-10-10T00:00:00.000Z")),
          }),
        ],
      });
      const dressModel = mapper.toModel(dress);
      expect(dressModel).toBeInstanceOf(DressModel);
      expect(dressModel.reservationPeriods).toHaveLength(1);
      const period = dressModel.reservationPeriods[0];
      expect(period.startDate).toEqual("2024-10-01T00:00:00.000Z");
      expect(period.endDate).toEqual("2024-10-10T00:00:00.000Z");
    });
  });
});
