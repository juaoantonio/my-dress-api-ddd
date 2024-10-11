import { Chance } from "chance";
import { DressFakeBuilder } from "./dress-fake.builder";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";

describe("DressFakeBuilder Unit Tests", () => {
  describe("id prop", () => {
    const faker = DressFakeBuilder.aDress();

    test("should throw error when any with methods has not been called", () => {
      expect(() => faker.id).not.toThrow();
    });

    test("should be defined by default", () => {
      const dress = faker.build();
      expect(dress.getId()).toBeInstanceOf(DressId);
    });

    test("withId", () => {
      const customId = DressId.create("118b9d75-53f1-4653-ae46-6021a1800d96");
      const $this = faker.withId(customId);
      expect($this).toBeInstanceOf(DressFakeBuilder);
      expect(faker["_id"]).toBe(customId);

      faker.withId(() =>
        DressId.create("459dcab0-5ae3-424e-b53a-403d1b1a96b0"),
      );
      //@ts-expect-error _id is callable
      expect(faker["_id"]()).toBeInstanceOf(DressId);

      const dressWithFactoryId = faker.build();
      expect(dressWithFactoryId.getId().value).toBe(
        "459dcab0-5ae3-424e-b53a-403d1b1a96b0",
      );
    });

    test("should pass index to id factory", () => {
      const mockFactory = vi.fn((index: number) =>
        DressId.create(`693ee659-e976-4665-aa70-529d5506ba5${index}`),
      );
      faker.withId(mockFactory);
      const dress = faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);
      expect(dress.getId().value).toBe("693ee659-e976-4665-aa70-529d5506ba50");

      const fakerMany = DressFakeBuilder.theDresses(2);
      fakerMany.withId(mockFactory);
      const dresses = fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(3); // 1 + 2
      expect(dresses[0].getId().value).toBe(
        "693ee659-e976-4665-aa70-529d5506ba50",
      );
      expect(dresses[1].getId().value).toBe(
        "693ee659-e976-4665-aa70-529d5506ba51",
      );
    });
  });

  describe("imagePath prop", () => {
    const faker = DressFakeBuilder.aDress();

    test("should be a function by default", () => {
      expect(typeof faker["_imagePath"]).toBe("function");
    });

    test("should call the url method", () => {
      const chance = new Chance();
      const spyUrlMethod = vi.spyOn(chance, "url");
      // Re-instantiate chance to inject spy
      faker["chance"] = chance;
      faker.build();

      expect(spyUrlMethod).toHaveBeenCalled();
    });

    test("withImagePath", () => {
      const customImagePath = "http://example.com/image.png";
      const $this = faker.withImagePath(customImagePath);
      expect($this).toBeInstanceOf(DressFakeBuilder);
      expect(faker["_imagePath"]).toBe(customImagePath);

      faker.withImagePath(() => "http://factory.com/image.png");
      //@ts-expect-error _imagePath is callable
      expect(faker["_imagePath"]()).toBe("http://factory.com/image.png");

      const dressWithCustomImagePath = faker.build();
      expect(dressWithCustomImagePath.getImagePath()).toBe(
        "http://factory.com/image.png",
      );
    });

    test("should pass index to imagePath factory", () => {
      faker.withImagePath((index) => `http://example.com/image-${index}.png`);
      const dress = faker.build();
      expect(dress.getImagePath()).toBe("http://example.com/image-0.png");

      const fakerMany = DressFakeBuilder.theDresses(2);
      fakerMany.withImagePath(
        (index) => `http://example.com/image-${index}.png`,
      );
      const dresses = fakerMany.build();

      expect(dresses[0].getImagePath()).toBe("http://example.com/image-0.png");
      expect(dresses[1].getImagePath()).toBe("http://example.com/image-1.png");
    });
  });

  describe("rentPrice prop", () => {
    const faker = DressFakeBuilder.aDress();

    test("should be a function by default", () => {
      expect(typeof faker["_rentPrice"]).toBe("function");
    });

    test("should call the floating method", () => {
      const chance = new Chance();
      const spyFloatingMethod = vi.spyOn(chance, "floating");
      faker["chance"] = chance;
      faker.build();

      expect(spyFloatingMethod).toHaveBeenCalled();
    });

    test("withRentPrice", () => {
      const customRentPrice = 250.75;
      const $this = faker.withRentPrice(customRentPrice);
      expect($this).toBeInstanceOf(DressFakeBuilder);
      expect(faker["_rentPrice"]).toBe(customRentPrice);

      faker.withRentPrice(() => 300.5);
      //@ts-expect-error _rentPrice is callable
      expect(faker["_rentPrice"]()).toBe(300.5);

      const dressWithCustomRentPrice = faker.build();
      expect(dressWithCustomRentPrice.getRentPrice()).toBe(300.5);
    });

    test("withInvalidRentPrice", () => {
      const $this = faker.withInvalidRentPrice();
      expect($this).toBeInstanceOf(DressFakeBuilder);
      expect(faker["_rentPrice"]).toBeLessThan(0);

      faker.withInvalidRentPrice(-500);
      expect(faker["_rentPrice"]).toBe(-500);
    });

    test("should pass index to rentPrice factory", () => {
      faker.withRentPrice((index) => 100 + index * 50);
      const dress = faker.build();
      expect(dress.getRentPrice()).toBe(100);

      const fakerMany = DressFakeBuilder.theDresses(2);
      fakerMany.withRentPrice((index) => 100 + index * 50);
      const dresses = fakerMany.build();

      expect(dresses[0].getRentPrice()).toBe(100);
      expect(dresses[1].getRentPrice()).toBe(150);
    });
  });

  describe("color prop", () => {
    const faker = DressFakeBuilder.aDress();

    test("should be a function by default", () => {
      expect(typeof faker["_color"]).toBe("function");
    });

    test("should call the color method", () => {
      const chance = new Chance();
      const spyColorMethod = vi.spyOn(chance, "word");
      faker["chance"] = chance;
      faker.build();

      expect(spyColorMethod).toHaveBeenCalled();
    });

    test("withColor", () => {
      const customColor = "#FF5733";
      const $this = faker.withColor(customColor);
      expect($this).toBeInstanceOf(DressFakeBuilder);
      expect(faker["_color"]).toBe(customColor);

      faker.withColor(() => "#123456");
      //@ts-expect-error _color is callable
      expect(faker["_color"]()).toBe("#123456");

      const dressWithCustomColor = faker.build();
      expect(dressWithCustomColor.getColor()).toBe("#123456");
    });

    test("withInvalidColor", () => {
      const $this = faker.withInvalidColor();
      expect($this).toBeInstanceOf(DressFakeBuilder);
      expect(faker["_color"]).toBe("");

      faker.withInvalidColor(""); // Explicit invalid value
      expect(faker["_color"]).toBe("");
    });

    test("should pass index to color factory", () => {
      faker.withColor((index) => `Cor-${index}`);
      const dress = faker.build();
      expect(dress.getColor()).toBe("Cor-0");

      const fakerMany = DressFakeBuilder.theDresses(2);
      fakerMany.withColor((index) => `Cor-${index}`);
      const dresses = fakerMany.build();

      expect(dresses[0].getColor()).toBe("Cor-0");
      expect(dresses[1].getColor()).toBe("Cor-1");
    });
  });

  describe("model prop", () => {
    const faker = DressFakeBuilder.aDress();

    test("should be a function by default", () => {
      expect(typeof faker["_model"]).toBe("function");
    });

    test("should call the word method", () => {
      const chance = new Chance();
      const spyWordMethod = vi.spyOn(chance, "word");
      faker["chance"] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test("withModel", () => {
      const customModel = "Summer2024";
      const $this = faker.withModel(customModel);
      expect($this).toBeInstanceOf(DressFakeBuilder);
      expect(faker["_model"]).toBe(customModel);

      faker.withModel(() => "Winter2024");
      //@ts-expect-error _model is callable
      expect(faker["_model"]()).toBe("Winter2024");

      const dressWithCustomModel = faker.build();
      expect(dressWithCustomModel.getModel()).toBe("Winter2024");
    });

    test("should pass index to model factory", () => {
      faker.withModel((index) => `Model-${index}`);
      const dress = faker.build();
      expect(dress.getModel()).toBe("Model-0");

      const fakerMany = DressFakeBuilder.theDresses(2);
      fakerMany.withModel((index) => `Model-${index}`);
      const dresses = fakerMany.build();

      expect(dresses[0].getModel()).toBe("Model-0");
      expect(dresses[1].getModel()).toBe("Model-1");
    });
  });

  describe("fabric prop", () => {
    const faker = DressFakeBuilder.aDress();

    test("should be a function by default", () => {
      expect(typeof faker["_fabric"]).toBe("function");
    });

    test("should call the word method", () => {
      const chance = new Chance();
      const spyWordMethod = vi.spyOn(chance, "word");
      faker["chance"] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test("withFabric", () => {
      const customFabric = "Seda";
      const $this = faker.withFabric(customFabric);
      expect($this).toBeInstanceOf(DressFakeBuilder);
      expect(faker["_fabric"]).toBe(customFabric);

      faker.withFabric(() => "Algodão");
      //@ts-expect-error _fabric is callable
      expect(faker["_fabric"]()).toBe("Algodão");

      const dressWithCustomFabric = faker.build();
      expect(dressWithCustomFabric.getFabric()).toBe("Algodão");
    });

    test("should pass index to fabric factory", () => {
      faker.withFabric((index) => `Fabric-${index}`);
      const dress = faker.build();
      expect(dress.getFabric()).toBe("Fabric-0");

      const fakerMany = DressFakeBuilder.theDresses(2);
      fakerMany.withFabric((index) => `Fabric-${index}`);
      const dresses = fakerMany.build();

      expect(dresses[0].getFabric()).toBe("Fabric-0");
      expect(dresses[1].getFabric()).toBe("Fabric-1");
    });
  });

  describe("isPickedUp prop", () => {
    const faker = DressFakeBuilder.aDress();

    test("should be a function by default", () => {
      expect(typeof faker["_isPickedUp"]).toBe("function");
    });

    test("should call the bool method", () => {
      const chance = new Chance();
      const spyBoolMethod = vi.spyOn(chance, "bool");
      faker["chance"] = chance;
      faker.build();

      expect(spyBoolMethod).toHaveBeenCalled();
    });

    test("withIsPickedUp", () => {
      const $this = faker.withIsPickedUp(true);
      expect($this).toBeInstanceOf(DressFakeBuilder);
      expect(faker["_isPickedUp"]).toBe(true);

      faker.withIsPickedUp(() => false);
      //@ts-expect-error _isPickedUp is callable
      expect(faker["_isPickedUp"]()).toBe(false);

      const dressWithCustomIsPickedUp = faker.build();
      expect(dressWithCustomIsPickedUp.getIsPickedUp()).toBe(false);
    });

    test("should pass index to isPickedUp factory", () => {
      faker.withIsPickedUp((index) => index % 2 === 0);
      const dress = faker.build();
      expect(dress.getIsPickedUp()).toBe(true);

      const fakerMany = DressFakeBuilder.theDresses(2);
      fakerMany.withIsPickedUp((index) => index === 1);
      const dresses = fakerMany.build();

      expect(dresses[0].getIsPickedUp()).toBe(false);
      expect(dresses[1].getIsPickedUp()).toBe(true);
    });
  });

  describe("reservationPeriods prop", () => {
    const faker = DressFakeBuilder.aDress();

    test("should be a function by default", () => {
      expect(typeof faker["_reservationPeriods"]).toBe("function");
    });

    test("should generate reservation periods", () => {
      const dress = faker.build();
      expect(Array.isArray(dress.getReservationPeriods())).toBe(true);
      dress.getReservationPeriods().forEach((period) => {
        expect(period).toBeInstanceOf(Period);
      });
    });

    test("withReservationPeriods", () => {
      const customPeriods = [
        { startDate: "2024-01-01", endDate: "2024-01-10" },
        { startDate: "2024-02-01", endDate: "2024-02-10" },
      ];
      const $this = faker.withReservationPeriods(customPeriods);
      expect($this).toBeInstanceOf(DressFakeBuilder);
      expect(faker["_reservationPeriods"]).toBe(customPeriods);

      faker.withReservationPeriods(() => [
        { startDate: "2024-03-01", endDate: "2024-03-10" },
      ]);
      //@ts-expect-error _reservationPeriods is callable
      expect(faker["_reservationPeriods"]()).toEqual([
        { startDate: "2024-03-01", endDate: "2024-03-10" },
      ]);

      const dressWithCustomPeriods = faker.build();
      expect(dressWithCustomPeriods.getReservationPeriods().length).toBe(1);
      expect(
        dressWithCustomPeriods.getReservationPeriods()[0].getStartDate(),
      ).toBeInstanceOf(DateVo);
      expect(
        dressWithCustomPeriods.getReservationPeriods()[0].getEndDate(),
      ).toBeInstanceOf(DateVo);
    });

    test("should pass index to reservationPeriods factory", () => {
      faker.withReservationPeriods((index) => [
        {
          startDate: `2024-0${index + 1}-01`,
          endDate: `2024-0${index + 1}-10`,
        },
      ]);
      const dress = faker.build();
      expect(dress.getReservationPeriods().length).toBe(1);
      expect(
        dress
          .getReservationPeriods()[0]
          .getStartDate()
          .getValue()
          .toISOString(),
      ).toContain("2024-01-01");
      expect(
        dress.getReservationPeriods()[0].getEndDate().getValue().toISOString(),
      ).toContain("2024-01-10");

      const fakerMany = DressFakeBuilder.theDresses(2);
      fakerMany.withReservationPeriods((index) => [
        {
          startDate: `2024-0${index + 2}-01`,
          endDate: `2024-0${index + 2}-10`,
        },
      ]);
      const dresses = fakerMany.build();

      expect(dresses[0].getReservationPeriods().length).toBe(1);
      expect(
        dresses[0]
          .getReservationPeriods()[0]
          .getStartDate()
          .getValue()
          .toISOString(),
      ).toContain("2024-02-01");
      expect(
        dresses[0]
          .getReservationPeriods()[0]
          .getEndDate()
          .getValue()
          .toISOString(),
      ).toContain("2024-02-10");

      expect(dresses[1].getReservationPeriods().length).toBe(1);
      expect(
        dresses[1]
          .getReservationPeriods()[0]
          .getStartDate()
          .getValue()
          .toISOString(),
      ).toContain("2024-03-01");
      expect(
        dresses[1]
          .getReservationPeriods()[0]
          .getEndDate()
          .getValue()
          .toISOString(),
      ).toContain("2024-03-10");
    });
  });

  describe("Behavior Methods", () => {
    const faker = DressFakeBuilder.aDress();

    test("activate", () => {
      const $this = faker.withIsPickedUp(false);
      expect($this).toBeInstanceOf(DressFakeBuilder);
    });

    test("deactivate", () => {
      const $this = faker.withIsPickedUp(true);
      expect($this).toBeInstanceOf(DressFakeBuilder);
    });
  });

  describe("build method", () => {
    test("should create a dress", () => {
      const faker = DressFakeBuilder.aDress();
      const dress = faker.build();

      expect(dress.getId()).toBeInstanceOf(DressId);
      expect(typeof dress.getImagePath() === "string").toBeTruthy();
      expect(typeof dress.getRentPrice() === "number").toBeTruthy();
      expect(typeof dress.getColor() === "string").toBeTruthy();
      expect(typeof dress.getModel() === "string").toBeTruthy();
      expect(typeof dress.getFabric() === "string").toBeTruthy();
      expect(typeof dress.getIsPickedUp() === "boolean").toBeTruthy();
      expect(dress.getReservationPeriods()).toBeInstanceOf(Array);
      expect(dress.getReservationPeriods().length).toBeGreaterThanOrEqual(0);
      dress.getReservationPeriods().forEach((period) => {
        expect(period).toBeInstanceOf(Period);
        expect(period.getStartDate()).toBeInstanceOf(DateVo);
        expect(period.getEndDate()).toBeInstanceOf(DateVo);
      });
    });

    test("should create a dress with custom properties", () => {
      const customId = DressId.create("c13a17f3-f271-4c2e-a2b4-e51a9525d0b7");
      const faker = DressFakeBuilder.aDress()
        .withId(customId)
        .withImagePath("http://example.com/dress.png")
        .withRentPrice(199.99)
        .withColor("#ABCDEF")
        .withModel("Elegant2024")
        .withFabric("Seda")
        .withIsPickedUp(true)
        .withReservationPeriods([
          { startDate: "2024-01-10", endDate: "2024-01-20" },
        ]);

      const dress = faker.build();

      expect(dress.getId().value).toBe("c13a17f3-f271-4c2e-a2b4-e51a9525d0b7");
      expect(dress.getImagePath()).toBe("http://example.com/dress.png");
      expect(dress.getRentPrice()).toBe(199.99);
      expect(dress.getColor()).toBe("#ABCDEF");
      expect(dress.getModel()).toBe("Elegant2024");
      expect(dress.getFabric()).toBe("Seda");
      expect(dress.getIsPickedUp()).toBe(true);
      expect(dress.getReservationPeriods().length).toBe(1);
      expect(
        dress.getReservationPeriods()[0].getStartDate().getValue(),
      ).toEqual(new Date("2024-01-10"));
      expect(dress.getReservationPeriods()[0].getEndDate().getValue()).toEqual(
        new Date("2024-01-20"),
      );
    });

    test("should create many dresses", () => {
      const faker = DressFakeBuilder.theDresses(2);
      const dresses = faker.build();

      expect(Array.isArray(dresses)).toBe(true);
      expect(dresses.length).toBe(2);

      dresses.forEach((dress) => {
        expect(dress.getId()).toBeInstanceOf(DressId);
        expect(typeof dress.getImagePath() === "string").toBeTruthy();
        expect(typeof dress.getRentPrice() === "number").toBeTruthy();
        expect(typeof dress.getColor() === "string").toBeTruthy();
        expect(typeof dress.getModel() === "string").toBeTruthy();
        expect(typeof dress.getFabric() === "string").toBeTruthy();
        expect(typeof dress.getIsPickedUp() === "boolean").toBeTruthy();
        expect(dress.getReservationPeriods()).toBeInstanceOf(Array);
        expect(dress.getReservationPeriods().length).toBeGreaterThanOrEqual(0);
        dress.getReservationPeriods().forEach((period) => {
          expect(period).toBeInstanceOf(Period);
          expect(period.getStartDate()).toBeInstanceOf(DateVo);
          expect(period.getEndDate()).toBeInstanceOf(DateVo);
        });
      });
    });

    test("should create many dresses with custom properties", () => {
      const customId1 = DressId.create("3f50c0b8-9d4b-4e2f-a3c1-2d9f4b8a5c3e");
      const customId2 = DressId.create("7a1d2e3f-4b5c-6d7e-8f90-a1b2c3d4e5f6");
      const faker = DressFakeBuilder.theDresses(2)
        .withId((index) => (index === 0 ? customId1 : customId2))
        .withImagePath((index) => `http://example.com/dress-${index}.png`)
        .withRentPrice((index) => 100 + index * 50)
        .withColor((index) => (index === 0 ? "#FFFFFF" : "#000000"))
        .withModel((index) => `Model-${index}`)
        .withFabric((index) => (index === 0 ? "Seda" : "Algodão"))
        .withIsPickedUp((index) => index === 0)
        .withReservationPeriods((index) => [
          {
            startDate: `2024-10-0${index + 1}`,
            endDate: `2024-10-0${index + 5}`,
          },
        ]);

      const dresses = faker.build();

      expect(dresses[0].getId().value).toBe(
        "3f50c0b8-9d4b-4e2f-a3c1-2d9f4b8a5c3e",
      );
      expect(dresses[0].getImagePath()).toBe("http://example.com/dress-0.png");
      expect(dresses[0].getRentPrice()).toBe(100);
      expect(dresses[0].getColor()).toBe("#FFFFFF");
      expect(dresses[0].getModel()).toBe("Model-0");
      expect(dresses[0].getFabric()).toBe("Seda");
      expect(dresses[0].getIsPickedUp()).toBe(true);
      expect(dresses[0].getReservationPeriods().length).toBe(1);
      expect(
        dresses[0].getReservationPeriods()[0].getStartDate().getValue(),
      ).toEqual(new Date("2024-10-01"));
      expect(
        dresses[0].getReservationPeriods()[0].getEndDate().getValue(),
      ).toEqual(new Date("2024-10-05"));

      expect(dresses[1].getId().value).toBe(
        "7a1d2e3f-4b5c-6d7e-8f90-a1b2c3d4e5f6",
      );
      expect(dresses[1].getImagePath()).toBe("http://example.com/dress-1.png");
      expect(dresses[1].getRentPrice()).toBe(150);
      expect(dresses[1].getColor()).toBe("#000000");
      expect(dresses[1].getModel()).toBe("Model-1");
      expect(dresses[1].getFabric()).toBe("Algodão");
      expect(dresses[1].getIsPickedUp()).toBe(false);
      expect(dresses[1].getReservationPeriods().length).toBe(1);
      expect(
        dresses[1].getReservationPeriods()[0].getStartDate().getValue(),
      ).toEqual(new Date("2024-10-02"));
      expect(
        dresses[1].getReservationPeriods()[0].getEndDate().getValue(),
      ).toEqual(new Date("2024-10-06"));
    });
  });

  describe("Validation", () => {
    test("should create a valid dress", () => {
      const faker = DressFakeBuilder.aDress();
      const dress = faker.build();
      expect(() => dress.validate()).not.toThrow();
    });

    test("should throw validation error for invalid rentPrice", () => {
      const faker = DressFakeBuilder.aDress().withInvalidRentPrice();
      const instance = faker.build();
      expect(instance.notification).notificationContainsErrorMessages([
        {
          rentPrice: ["Preço de aluguel deve ser positivo"],
        },
      ]);
    });

    test("should throw validation error for invalid color", () => {
      const faker = DressFakeBuilder.aDress().withInvalidColor();
      const instance = faker.build();
      expect(instance.notification).notificationContainsErrorMessages([
        {
          color: ["Cor não pode ser vazia"],
        },
      ]);
    });
  });
});
