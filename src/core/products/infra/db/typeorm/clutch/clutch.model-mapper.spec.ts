import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { v4 as uuidv4 } from "uuid";
import { ClutchModelMapper } from "@core/products/infra/db/typeorm/clutch/clutch.model-mapper";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";

describe("ClutchModelMapper", () => {
  let mapper: ClutchModelMapper;

  beforeEach(() => {
    mapper = new ClutchModelMapper();
  });

  describe("toEntity", () => {
    it("should map ClutchModel to Clutch entity correctly without optional fields", () => {
      const clutchModel = new ClutchModel();
      clutchModel.id = uuidv4();
      clutchModel.imageUrl = "https://example.com/clutch.png";
      clutchModel.model = "Clutch Bag";
      clutchModel.color = "Black";
      clutchModel.rentPrice = 80.0;
      clutchModel.isPickedUp = false;
      const clutch = mapper.toEntity(clutchModel);
      expect(clutch).toBeInstanceOf(Clutch);
      expect(clutch.getId().getValue()).toBe(clutchModel.id);
      expect(clutch.getImagePath()).toBe("https://example.com/clutch.png");
      expect(clutch.getModel()).toBe("Clutch Bag");
      expect(clutch.getColor()).toBe("Black");
      expect(clutch.getRentPrice()).toBe(80.0);
      expect(clutch.getIsPickedUp()).toBe(false);
      expect(clutch.getReservationPeriods()).toHaveLength(0);
    });

    it("should map ClutchModel to Clutch entity correctly with all fields", () => {
      const clutchModel = new ClutchModel();
      clutchModel.id = uuidv4();
      clutchModel.imageUrl = "https://example.com/clutch.png";
      clutchModel.model = "Clutch Bag";
      clutchModel.color = "Black";
      clutchModel.rentPrice = 80.0;
      clutchModel.isPickedUp = false;
      const clutch = mapper.toEntity(clutchModel);
      expect(clutch).toBeInstanceOf(Clutch);
      expect(clutch.getImagePath()).toBe("https://example.com/clutch.png");
      expect(clutch.getModel()).toBe("Clutch Bag");
      expect(clutch.getColor()).toBe("Black");
      expect(clutch.getRentPrice()).toBe(80.0);
      expect(clutch.getIsPickedUp()).toBe(false);
    });
  });

  describe("toModel", () => {
    it("should map Clutch entity to ClutchModel correctly without optional fields", () => {
      const clutch = new Clutch({
        id: ClutchId.create(uuidv4()),
        imagePath: "https://example.com/clutch.png",
        model: "Clutch Bag",
        color: "Black",
        rentPrice: 80.0,
        isPickedUp: false,
        reservationPeriods: [],
      });
      const clutchModel = mapper.toModel(clutch);
      expect(clutchModel).toBeInstanceOf(ClutchModel);
      expect(clutchModel.id).toBe(clutch.getId().getValue());
      expect(clutchModel.imageUrl).toBe(clutch.getImagePath());
      expect(clutchModel.model).toBe(clutch.getModel());
      expect(clutchModel.color).toBe(clutch.getColor());
      expect(clutchModel.rentPrice).toBe(clutch.getRentPrice());
      expect(clutchModel.isPickedUp).toBe(false);
    });

    it("should map Clutch entity to ClutchModel correctly with all fields", () => {
      const clutch = new Clutch({
        id: ClutchId.create(uuidv4()),
        imagePath: "https://example.com/clutch.png",
        model: "Clutch Bag",
        color: "Black",
        rentPrice: 80.0,
        isPickedUp: false,
      });
      const clutchModel = mapper.toModel(clutch);
      expect(clutchModel).toBeInstanceOf(ClutchModel);
    });
  });
});
