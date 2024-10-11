import { Chance } from "chance";
import { ClutchFakeBuilder } from "./clutch-fake.builder";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";

describe("ClutchFakeBuilder Unit Tests", () => {
  describe("id prop", () => {
    const faker = ClutchFakeBuilder.aClutch();

    test("should not throw error when any with methods has not been called", () => {
      expect(() => faker.id).not.toThrow();
    });

    test("should be defined by default", () => {
      const clutch = faker.build();
      expect(clutch.getId()).toBeInstanceOf(ClutchId);
    });

    test("withId", () => {
      const customId = ClutchId.create("118b9d75-53f1-4653-ae46-6021a1800d96");
      const $this = faker.withId(customId);
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      expect(faker["_id"]).toBe(customId);

      faker.withId(() =>
        ClutchId.create("459dcab0-5ae3-424e-b53a-403d1b1a96b0"),
      );
      //@ts-expect-error _id is callable
      expect(faker["_id"]()).toBeInstanceOf(ClutchId);

      const clutchWithFactoryId = faker.build();
      expect(clutchWithFactoryId.getId().value).toBe(
        "459dcab0-5ae3-424e-b53a-403d1b1a96b0",
      );
    });

    test("should pass index to id factory", () => {
      const mockFactory = vi.fn((index: number) =>
        ClutchId.create(`693ee659-e976-4665-aa70-529d5506ba5${index}`),
      );
      faker.withId(mockFactory);
      const clutch = faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);
      expect(clutch.getId().value).toBe("693ee659-e976-4665-aa70-529d5506ba50");

      const fakerMany = ClutchFakeBuilder.theClutches(2);
      fakerMany.withId(mockFactory);
      const clutches = fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(3); // 1 + 2
      expect(clutches[0].getId().value).toBe(
        "693ee659-e976-4665-aa70-529d5506ba50",
      );
      expect(clutches[1].getId().value).toBe(
        "693ee659-e976-4665-aa70-529d5506ba51",
      );
    });
  });

  describe("imagePath prop", () => {
    const faker = ClutchFakeBuilder.aClutch();

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
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      expect(faker["_imagePath"]).toBe(customImagePath);

      faker.withImagePath(() => "http://factory.com/image.png");
      //@ts-expect-error _imagePath is callable
      expect(faker["_imagePath"]()).toBe("http://factory.com/image.png");

      const clutchWithCustomImagePath = faker.build();
      expect(clutchWithCustomImagePath.getImagePath()).toBe(
        "http://factory.com/image.png",
      );
    });

    test("should pass index to imagePath factory", () => {
      faker.withImagePath((index) => `http://example.com/image-${index}.png`);
      const clutch = faker.build();
      expect(clutch.getImagePath()).toBe("http://example.com/image-0.png");

      const fakerMany = ClutchFakeBuilder.theClutches(2);
      fakerMany.withImagePath(
        (index) => `http://example.com/image-${index}.png`,
      );
      const clutches = fakerMany.build();

      expect(clutches[0].getImagePath()).toBe("http://example.com/image-0.png");
      expect(clutches[1].getImagePath()).toBe("http://example.com/image-1.png");
    });
  });

  describe("rentPrice prop", () => {
    const faker = ClutchFakeBuilder.aClutch();

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
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      expect(faker["_rentPrice"]).toBe(customRentPrice);

      faker.withRentPrice(() => 300.5);
      //@ts-expect-error _rentPrice is callable
      expect(faker["_rentPrice"]()).toBe(300.5);

      const clutchWithCustomRentPrice = faker.build();
      expect(clutchWithCustomRentPrice.getRentPrice()).toBe(300.5);
    });

    test("withInvalidRentPrice", () => {
      const $this = faker.withInvalidRentPrice();
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      expect(faker["_rentPrice"]).toBeLessThan(0);

      faker.withInvalidRentPrice(-500);
      expect(faker["_rentPrice"]).toBe(-500);
    });

    test("should pass index to rentPrice factory", () => {
      faker.withRentPrice((index) => 100 + index * 50);
      const clutch = faker.build();
      expect(clutch.getRentPrice()).toBe(100);

      const fakerMany = ClutchFakeBuilder.theClutches(2);
      fakerMany.withRentPrice((index) => 100 + index * 50);
      const clutches = fakerMany.build();

      expect(clutches[0].getRentPrice()).toBe(100);
      expect(clutches[1].getRentPrice()).toBe(150);
    });
  });

  describe("color prop", () => {
    const faker = ClutchFakeBuilder.aClutch();

    test("should be a function by default", () => {
      expect(typeof faker["_color"]).toBe("function");
    });

    test("should call the word method", () => {
      const chance = new Chance();
      const spyColorMethod = vi.spyOn(chance, "word");
      faker["chance"] = chance;
      faker.build();

      expect(spyColorMethod).toHaveBeenCalled();
    });

    test("withColor", () => {
      const customColor = "#FF5733";
      const $this = faker.withColor(customColor);
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      expect(faker["_color"]).toBe(customColor);

      faker.withColor(() => "#123456");
      //@ts-expect-error _color is callable
      expect(faker["_color"]()).toBe("#123456");

      const clutchWithCustomColor = faker.build();
      expect(clutchWithCustomColor.getColor()).toBe("#123456");
    });

    test("withInvalidColor", () => {
      const $this = faker.withInvalidColor();
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      expect(faker["_color"]).toBe("");

      faker.withInvalidColor(""); // Explicit invalid value
      expect(faker["_color"]).toBe("");
    });

    test("should pass index to color factory", () => {
      faker.withColor((index) => `Cor-${index}`);
      const clutch = faker.build();
      expect(clutch.getColor()).toBe("Cor-0");

      const fakerMany = ClutchFakeBuilder.theClutches(2);
      fakerMany.withColor((index) => `Cor-${index}`);
      const clutches = fakerMany.build();

      expect(clutches[0].getColor()).toBe("Cor-0");
      expect(clutches[1].getColor()).toBe("Cor-1");
    });
  });

  describe("model prop", () => {
    const faker = ClutchFakeBuilder.aClutch();

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
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      expect(faker["_model"]).toBe(customModel);

      faker.withModel(() => "Winter2024");
      //@ts-expect-error _model is callable
      expect(faker["_model"]()).toBe("Winter2024");

      const clutchWithCustomModel = faker.build();
      expect(clutchWithCustomModel.getModel()).toBe("Winter2024");
    });

    test("should pass index to model factory", () => {
      faker.withModel((index) => `Model-${index}`);
      const clutch = faker.build();
      expect(clutch.getModel()).toBe("Model-0");

      const fakerMany = ClutchFakeBuilder.theClutches(2);
      fakerMany.withModel((index) => `Model-${index}`);
      const clutches = fakerMany.build();

      expect(clutches[0].getModel()).toBe("Model-0");
      expect(clutches[1].getModel()).toBe("Model-1");
    });
  });

  describe("isPickedUp prop", () => {
    const faker = ClutchFakeBuilder.aClutch();

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
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      expect(faker["_isPickedUp"]).toBe(true);

      faker.withIsPickedUp(() => false);
      //@ts-expect-error _isPickedUp is callable
      expect(faker["_isPickedUp"]()).toBe(false);

      const clutchWithCustomIsPickedUp = faker.build();
      expect(clutchWithCustomIsPickedUp.getIsPickedUp()).toBe(false);
    });

    test("should pass index to isPickedUp factory", () => {
      faker.withIsPickedUp((index) => index % 2 === 0);
      const clutch = faker.build();
      expect(clutch.getIsPickedUp()).toBe(true);

      const fakerMany = ClutchFakeBuilder.theClutches(2);
      fakerMany.withIsPickedUp((index) => index === 1);
      const clutches = fakerMany.build();

      expect(clutches[0].getIsPickedUp()).toBe(false);
      expect(clutches[1].getIsPickedUp()).toBe(true);
    });
  });

  describe("reservationPeriods prop", () => {
    const faker = ClutchFakeBuilder.aClutch();

    test("should be a function by default", () => {
      expect(typeof faker["_reservationPeriods"]).toBe("function");
    });

    test("should generate reservation periods", () => {
      const clutch = faker.build();
      expect(Array.isArray(clutch.getReservationPeriods())).toBe(true);
      clutch.getReservationPeriods().forEach((period) => {
        expect(period).toBeInstanceOf(Period);
      });
    });

    test("withReservationPeriods", () => {
      const customPeriods = [
        { startDate: "2024-01-01", endDate: "2024-01-10" },
        { startDate: "2024-02-01", endDate: "2024-02-10" },
      ];
      const $this = faker.withReservationPeriods(customPeriods);
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      expect(faker["_reservationPeriods"]).toBe(customPeriods);

      faker.withReservationPeriods(() => [
        { startDate: "2024-03-01", endDate: "2024-03-10" },
      ]);
      //@ts-expect-error _reservationPeriods is callable
      expect(faker["_reservationPeriods"]()).toEqual([
        { startDate: "2024-03-01", endDate: "2024-03-10" },
      ]);

      const clutchWithCustomPeriods = faker.build();
      expect(clutchWithCustomPeriods.getReservationPeriods().length).toBe(1);
      expect(
        clutchWithCustomPeriods.getReservationPeriods()[0].getStartDate(),
      ).toBeInstanceOf(DateVo);
      expect(
        clutchWithCustomPeriods.getReservationPeriods()[0].getEndDate(),
      ).toBeInstanceOf(DateVo);
    });

    test("should pass index to reservationPeriods factory", () => {
      faker.withReservationPeriods((index) => [
        {
          startDate: `2024-0${index + 1}-01`,
          endDate: `2024-0${index + 1}-10`,
        },
      ]);
      const clutch = faker.build();
      expect(clutch.getReservationPeriods().length).toBe(1);
      expect(
        clutch
          .getReservationPeriods()[0]
          .getStartDate()
          .getValue()
          .toISOString(),
      ).toContain("2024-01-01");
      expect(
        clutch.getReservationPeriods()[0].getEndDate().getValue().toISOString(),
      ).toContain("2024-01-10");

      const fakerMany = ClutchFakeBuilder.theClutches(2);
      fakerMany.withReservationPeriods((index) => [
        {
          startDate: `2024-0${index + 2}-01`,
          endDate: `2024-0${index + 2}-10`,
        },
      ]);
      const clutches = fakerMany.build();

      expect(clutches[0].getReservationPeriods().length).toBe(1);
      expect(
        clutches[0]
          .getReservationPeriods()[0]
          .getStartDate()
          .getValue()
          .toISOString(),
      ).toContain("2024-02-01");
      expect(
        clutches[0]
          .getReservationPeriods()[0]
          .getEndDate()
          .getValue()
          .toISOString(),
      ).toContain("2024-02-10");

      expect(clutches[1].getReservationPeriods().length).toBe(1);
      expect(
        clutches[1]
          .getReservationPeriods()[0]
          .getStartDate()
          .getValue()
          .toISOString(),
      ).toContain("2024-03-01");
      expect(
        clutches[1]
          .getReservationPeriods()[0]
          .getEndDate()
          .getValue()
          .toISOString(),
      ).toContain("2024-03-10");
    });
  });

  describe("Behavior Methods", () => {
    const faker = ClutchFakeBuilder.aClutch();

    test("activate", () => {
      const $this = faker.withIsPickedUp(false).withIsPickedUp(true);
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      // Como não existem métodos 'activate' ou 'deactivate' no ClutchFakeBuilder,
      // estamos ajustando os estados diretamente via 'withIsPickedUp'.
      // Se houver métodos específicos, adicione os testes correspondentes.
    });

    test("deactivate", () => {
      const $this = faker.withIsPickedUp(true).withIsPickedUp(false);
      expect($this).toBeInstanceOf(ClutchFakeBuilder);
      // Similar ao teste de 'activate', ajuste conforme necessário.
    });
  });

  describe("build method", () => {
    test("should create a clutch", () => {
      const faker = ClutchFakeBuilder.aClutch();
      const clutch = faker.build();

      expect(clutch.getId()).toBeInstanceOf(ClutchId);
      expect(typeof clutch.getImagePath() === "string").toBeTruthy();
      expect(typeof clutch.getRentPrice() === "number").toBeTruthy();
      expect(typeof clutch.getColor() === "string").toBeTruthy();
      expect(typeof clutch.getModel() === "string").toBeTruthy();
      expect(typeof clutch.getIsPickedUp() === "boolean").toBeTruthy();
      expect(clutch.getReservationPeriods()).toBeInstanceOf(Array);
      expect(clutch.getReservationPeriods().length).toBeGreaterThanOrEqual(0);
      clutch.getReservationPeriods().forEach((period) => {
        expect(period).toBeInstanceOf(Period);
        expect(period.getStartDate()).toBeInstanceOf(DateVo);
        expect(period.getEndDate()).toBeInstanceOf(DateVo);
      });
    });

    test("should create a clutch with custom properties", () => {
      const customId = ClutchId.create("c13a17f3-f271-4c2e-a2b4-e51a9525d0b7");
      const faker = ClutchFakeBuilder.aClutch()
        .withId(customId)
        .withImagePath("http://example.com/clutch.png")
        .withRentPrice(199.99)
        .withColor("#ABCDEF")
        .withModel("Elegant2024")
        .withIsPickedUp(true)
        .withReservationPeriods([
          { startDate: "2024-01-10", endDate: "2024-01-20" },
        ]);

      const clutch = faker.build();

      expect(clutch.getId().value).toBe("c13a17f3-f271-4c2e-a2b4-e51a9525d0b7");
      expect(clutch.getImagePath()).toBe("http://example.com/clutch.png");
      expect(clutch.getRentPrice()).toBe(199.99);
      expect(clutch.getColor()).toBe("#ABCDEF");
      expect(clutch.getModel()).toBe("Elegant2024");
      expect(clutch.getIsPickedUp()).toBe(true);
      expect(clutch.getReservationPeriods().length).toBe(1);
      expect(
        clutch.getReservationPeriods()[0].getStartDate().getValue(),
      ).toEqual(new Date("2024-01-10"));
      expect(clutch.getReservationPeriods()[0].getEndDate().getValue()).toEqual(
        new Date("2024-01-20"),
      );
    });

    test("should create many clutches", () => {
      const faker = ClutchFakeBuilder.theClutches(2);
      const clutches = faker.build();

      expect(Array.isArray(clutches)).toBe(true);
      expect(clutches.length).toBe(2);

      clutches.forEach((clutch) => {
        expect(clutch.getId()).toBeInstanceOf(ClutchId);
        expect(typeof clutch.getImagePath() === "string").toBeTruthy();
        expect(typeof clutch.getRentPrice() === "number").toBeTruthy();
        expect(typeof clutch.getColor() === "string").toBeTruthy();
        expect(typeof clutch.getModel() === "string").toBeTruthy();
        expect(typeof clutch.getIsPickedUp() === "boolean").toBeTruthy();
        expect(clutch.getReservationPeriods()).toBeInstanceOf(Array);
        expect(clutch.getReservationPeriods().length).toBeGreaterThanOrEqual(0);
        clutch.getReservationPeriods().forEach((period) => {
          expect(period).toBeInstanceOf(Period);
          expect(period.getStartDate()).toBeInstanceOf(DateVo);
          expect(period.getEndDate()).toBeInstanceOf(DateVo);
        });
      });
    });

    test("should create many clutches with custom properties", () => {
      const customId1 = ClutchId.create("3f50c0b8-9d4b-4e2f-a3c1-2d9f4b8a5c3e");
      const customId2 = ClutchId.create("7a1d2e3f-4b5c-6d7e-8f90-a1b2c3d4e5f6");

      const faker = ClutchFakeBuilder.theClutches(2)
        .withId((index) => (index === 0 ? customId1 : customId2))
        .withImagePath((index) => `http://example.com/clutch-${index}.png`)
        .withRentPrice((index) => 100 + index * 50)
        .withColor((index) => (index === 0 ? "#FFFFFF" : "#000000"))
        .withModel((index) => `Model-${index}`)
        .withIsPickedUp((index) => index === 0)
        .withReservationPeriods((index) => [
          {
            startDate: `2024-10-0${index + 1}`,
            endDate: `2024-10-0${index + 5}`,
          },
        ]);

      const clutches = faker.build();

      expect(clutches[0].getId().value).toBe(
        "3f50c0b8-9d4b-4e2f-a3c1-2d9f4b8a5c3e",
      );
      expect(clutches[0].getImagePath()).toBe(
        "http://example.com/clutch-0.png",
      );
      expect(clutches[0].getRentPrice()).toBe(100);
      expect(clutches[0].getColor()).toBe("#FFFFFF");
      expect(clutches[0].getModel()).toBe("Model-0");
      expect(clutches[0].getIsPickedUp()).toBe(true);
      expect(clutches[0].getReservationPeriods().length).toBe(1);
      expect(
        clutches[0].getReservationPeriods()[0].getStartDate().getValue(),
      ).toEqual(new Date("2024-10-01"));
      expect(
        clutches[0].getReservationPeriods()[0].getEndDate().getValue(),
      ).toEqual(new Date("2024-10-05"));

      expect(clutches[1].getId().value).toBe(
        "7a1d2e3f-4b5c-6d7e-8f90-a1b2c3d4e5f6",
      );
      expect(clutches[1].getImagePath()).toBe(
        "http://example.com/clutch-1.png",
      );
      expect(clutches[1].getRentPrice()).toBe(150);
      expect(clutches[1].getColor()).toBe("#000000");
      expect(clutches[1].getModel()).toBe("Model-1");
      expect(clutches[1].getIsPickedUp()).toBe(false);
      expect(clutches[1].getReservationPeriods().length).toBe(1);
      expect(
        clutches[1].getReservationPeriods()[0].getStartDate().getValue(),
      ).toEqual(new Date("2024-10-02"));
      expect(
        clutches[1].getReservationPeriods()[0].getEndDate().getValue(),
      ).toEqual(new Date("2024-10-06"));
    });
  });

  describe("Validation", () => {
    test("should create a valid clutch", () => {
      const faker = ClutchFakeBuilder.aClutch();
      const clutch = faker.build();
      expect(() => clutch.validate()).not.toThrow();
    });

    test("should throw validation error for invalid rentPrice", () => {
      const faker = ClutchFakeBuilder.aClutch().withInvalidRentPrice();
      const instance = faker.build();
      expect(instance.notification).notificationContainsErrorMessages([
        {
          rentPrice: ["Preço de aluguel deve ser positivo"],
        },
      ]);
    });

    test("should throw validation error for invalid color", () => {
      const faker = ClutchFakeBuilder.aClutch().withInvalidColor();
      const instance = faker.build();
      expect(instance.notification).notificationContainsErrorMessages([
        {
          color: ["Cor não pode ser vazia"],
        },
      ]);
    });
  });
});
