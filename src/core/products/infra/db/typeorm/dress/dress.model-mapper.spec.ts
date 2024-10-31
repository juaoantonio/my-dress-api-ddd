import { Dress } from "@core/products/domain/dress/dress.aggregate-root";

import { v4 as uuidv4 } from "uuid";
import { DressModelMapper } from "@core/products/infra/db/typeorm/dress/dress.model-mapper";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { DressId } from "@core/products/domain/dress/dress-id.vo";

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
      const dress = mapper.toEntity(dressModel);
      expect(dress).toBeInstanceOf(Dress);
      expect(dress.getId().getValue()).toBe(dressModel.id);
      expect(dress.getImagePath()).toBe("https://example.com/image.png");
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

      const dress = mapper.toEntity(dressModel);
      expect(dress).toBeInstanceOf(Dress);
      expect(dress.getImagePath()).toBe("https://example.com/image.png");
      expect(dress.getModel()).toBe("Evening Dress");
      expect(dress.getColor()).toBe("Red");
      expect(dress.getFabric()).toBe("Silk");
      expect(dress.getRentPrice()).toBe(200.0);
      expect(dress.getIsPickedUp()).toBe(false);
    });
  });

  describe("toModel", () => {
    it("should map Dress entity to DressModel correctly without optional fields", () => {
      // Arrange
      const dress = new Dress({
        id: DressId.create(uuidv4()),
        imagePath: "https://example.com/image.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
      });
      const dressModel = mapper.toModel(dress);
      expect(dressModel).toBeInstanceOf(DressModel);
      expect(dressModel.id).toBe(dress.getId().getValue());
      expect(dressModel.imageUrl).toBe(dress.getImagePath());
      expect(dressModel.model).toBe(dress.getModel());
      expect(dressModel.color).toBe(dress.getColor());
      expect(dressModel.fabric).toBe(dress.getFabric());
      expect(dressModel.rentPrice).toBe(dress.getRentPrice());
      expect(dressModel.isPickedUp).toBe(false);
    });

    it("should map Dress entity to DressModel correctly with all fields", () => {
      const dress = new Dress({
        id: DressId.create(uuidv4()),
        imagePath: "https://example.com/image.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
      });
      const dressModel = mapper.toModel(dress);
      expect(dressModel).toBeInstanceOf(DressModel);
    });
  });
});
