import { Dress } from "@domain/dress/dress.entity";
import { DressId } from "@domain/dress/dress-id.vo";
import { DressDescription } from "@domain/dress/dress-description.vo";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Dress Entity Unit Tests", function () {
  beforeEach(() => {
    vi.spyOn(Dress, "validate");
    vi.spyOn(DressDescription, "validate");
  });

  describe("Dress Create Constructor", function () {
    it("should create a Dress with id", function () {
      const dress = new Dress({
        id: DressId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        description: new DressDescription({
          color: "Marsala",
          model: "Tomara que caia",
          fabric: "Tule",
        }),
      });

      expect(dress.getId()).toBe("81d4babd-9644-4b6a-afaf-930f6608f6d5");
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImageUrl()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);
      expect(dress.getModel()).toBe("Tomara que caia");
      expect(dress.getColor()).toBe("Marsala");
      expect(dress.getFabric()).toBe("Tule");
      expect(Dress.validate).toHaveBeenCalledTimes(1);
    });

    it("should create Dress without id", () => {
      const dress = new Dress({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        description: new DressDescription({
          color: "Marsala",
          model: "Tomara que caia",
          fabric: "Tule",
        }),
      });

      expect(dress.getId()).toBeDefined();
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImageUrl()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);
      expect(Dress.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Dress Create Factory Method", function () {
    it("should create a Dress with id", function () {
      const dress = Dress.create({
        id: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        description: {
          color: "Marsala",
          model: "Tomara que caia",
          fabric: "Tule",
        },
      });

      expect(dress.getId()).toBe("81d4babd-9644-4b6a-afaf-930f6608f6d5");
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImageUrl()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);
      expect(Dress.validate).toHaveBeenCalledTimes(1);
    });

    it("should create Dress without id", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        description: {
          color: "Marsala",
          model: "Tomara que caia",
          fabric: "Tule",
        },
      });

      expect(dress.getId()).toBeDefined();
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImageUrl()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);
      expect(Dress.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Dress Change Methods", function () {
    it("should pickup a Dress", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        description: {
          color: "Marsala",
          model: "Tomara que caia",
          fabric: "Tule",
        },
      });

      expect(dress.getIsPickedUp()).toBe(false);

      dress.pickUp();

      expect(dress.getIsPickedUp()).toBe(true);
      expect(Dress.validate).toHaveBeenCalledTimes(1);
    });

    it("should return a Dress", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        description: {
          color: "Marsala",
          model: "Tomara que caia",
          fabric: "Tule",
        },
      });

      dress.pickUp();
      expect(dress.getIsPickedUp()).toBe(true);

      dress.returned();
      expect(dress.getIsPickedUp()).toBe(false);
      expect(Dress.validate).toHaveBeenCalledTimes(1);
    });

    it("should change price", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        description: {
          color: "Marsala",
          model: "Tomara que caia",
          fabric: "Tule",
        },
      });

      expect(dress.getRentPrice()).toBe(100);
      dress.changeRentPrice(200);

      expect(dress.getRentPrice()).toBe(200);

      dress.changeRentPrice(200);
      expect(dress.getRentPrice()).toBe(200);
      expect(Dress.validate).toHaveBeenCalledTimes(3);
    });

    it("should change description", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        description: {
          color: "Marsala",
          model: "Tomara que caia",
          fabric: "Tule",
        },
      });

      dress.changeDescription(
        new DressDescription({
          color: "Azul",
          model: "Decote em V",
          fabric: "Seda",
        }),
      );

      expect(Dress.validate).toHaveBeenCalledTimes(1);
    });

    it("should change image url", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        description: {
          color: "Marsala",
          model: "Tomara que caia",
          fabric: "Tule",
        },
      });

      dress.changeImageUrl("https://teste.png");
      expect(dress.getImageUrl()).toBe("https://teste.png");
      expect(Dress.validate).toHaveBeenCalledTimes(2);
    });
  });

  describe("Dress Validation", function () {
    describe("Dress Create Validation", function () {
      const scenarios = [
        {
          data: {
            imageUrl: "",
            rentPrice: 100,
            description: {
              color: "Marsala",
              model: "Tomara que caia",
              fabric: "Tule",
            },
          },
          errors: {
            imageUrl: [
              "Url da imagem não pode ser vazia",
              "Url da imagem deve ser válida",
            ],
          },
        },
        {
          data: {
            imageUrl: "https://www.google.com",
            rentPrice: 0,
            description: {
              color: "Marsala",
              model: "Tomara que caia",
              fabric: "Tule",
            },
          },
          errors: {
            rentPrice: ["Preço de aluguel deve ser um número positivo"],
          },
        },
        {
          data: {
            imageUrl: "https://www.google.com",
            rentPrice: -1,
            description: {
              color: "Marsala",
              model: "Tomara que caia",
              fabric: "Tule",
            },
          },
          errors: {
            rentPrice: ["Preço de aluguel deve ser um número positivo"],
          },
        },
      ];
      it.each(scenarios)(
        "should validate the creation of a Dress",
        (scenario) => {
          expect(() => Dress.create(scenario.data)).containsErrorMessages(
            scenario.errors,
          );
          expect(Dress.validate).toHaveBeenCalledTimes(1);
        },
      );
    });

    describe("Dress Description Validation", function () {
      const scenarios = [
        {
          data: {
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            description: {
              color: "Marsala",
              model: "",
              fabric: "Tule",
            },
          },
          errors: {
            model: ["Modelo do vestido não pode ser vazio"],
          },
        },
        {
          data: {
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            description: {
              color: "Marsala",
              model: "Tomara que caia",
              fabric: "",
            },
          },
          errors: {
            fabric: ["Tecido do vestido não pode ser vazio"],
          },
        },
        {
          data: {
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            description: {
              color: "",
              model: "Tomara que caia",
              fabric: "Tule",
            },
          },
          errors: {
            color: ["Cor do vestido não pode ser vazia"],
          },
        },
      ];

      it.each(scenarios)(
        "should validate the creation of a new Dress Description",
        (scenario) => {
          expect(() => Dress.create(scenario.data)).containsErrorMessages(
            scenario.errors,
          );
          expect(DressDescription.validate).toHaveBeenCalledTimes(1);
        },
      );
    });

    describe("Dress Change Validation", function () {
      it("should validate the change of a Dress Image Url", () => {
        const dress = Dress.create({
          imageUrl: "https://www.google.com",
          rentPrice: 100,
          description: {
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          },
        });

        expect(() => dress.changeImageUrl("")).containsErrorMessages({
          imageUrl: [
            "Url da imagem não pode ser vazia",
            "Url da imagem deve ser válida",
          ],
        });
        expect(Dress.validate).toHaveBeenCalledTimes(2);
      });

      it("should validate the change of a Dress Rent Price", () => {
        const dress = Dress.create({
          imageUrl: "https://www.google.com",
          rentPrice: 100,
          description: {
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          },
        });

        expect(() => dress.changeRentPrice(0)).containsErrorMessages({
          rentPrice: ["Preço de aluguel deve ser um número positivo"],
        });
        expect(Dress.validate).toHaveBeenCalledTimes(2);
      });
    });
  });
});
