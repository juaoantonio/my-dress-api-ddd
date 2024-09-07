import { describe, expect, it } from "vitest";
import { Dress } from "@domain/dress/dress.entity";
import { DressId } from "@domain/dress/dress-id.vo";
import { DressDescription } from "@domain/dress/dress-description.vo";

describe("Dress Entity Unit Tests", function () {
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
    });

    it("should not create dress without valid description", () => {
      expect(
        () =>
          new Dress({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            description: new DressDescription({
              color: "Marsala",
              model: "",
              fabric: "Tule",
            }),
          }),
      ).toThrowError("Modelo do vestido não pode ser vazio");

      expect(
        () =>
          new Dress({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            description: new DressDescription({
              color: "Marsala",
              model: "Tomara que caia",
              fabric: "",
            }),
          }),
      ).toThrowError("Tecido do vestido não pode ser vazio");

      expect(
        () =>
          new Dress({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            description: new DressDescription({
              color: "",
              model: "Tomara que caia",
              fabric: "Tule",
            }),
          }),
      ).toThrowError("Cor do vestido não pode ser vazia");
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
    });

    it("should not create dress without valid description", () => {
      expect(() =>
        Dress.create({
          imageUrl: "https://www.google.com",
          rentPrice: 100,
          description: {
            color: "Marsala",
            model: "",
            fabric: "Tule",
          },
        }),
      ).toThrowError("Modelo do vestido não pode ser vazio");

      expect(() =>
        Dress.create({
          imageUrl: "https://www.google.com",
          rentPrice: 100,
          description: {
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "",
          },
        }),
      ).toThrowError("Tecido do vestido não pode ser vazio");

      expect(() =>
        Dress.create({
          imageUrl: "https://www.google.com",
          rentPrice: 100,
          description: {
            color: "",
            model: "Tomara que caia",
            fabric: "Tule",
          },
        }),
      ).toThrowError("Cor do vestido não pode ser vazia");
    });

    it("should not create dress with negative price", () => {
      expect(() =>
        Dress.create({
          imageUrl: "https://www.google.com",
          rentPrice: -100,
          description: {
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          },
        }),
      ).toThrowError("Preço não pode ser negativo");
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
      dress.changeRentPrice(0);

      expect(dress.getRentPrice()).toBe(0);
      dress.changeRentPrice(200);
      expect(dress.getRentPrice()).toBe(200);
    });

    it("should not change rent price with negative number", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        description: {
          color: "Marsala",
          model: "Tomara que caia",
          fabric: "Tule",
        },
      });

      expect(() => dress.changeRentPrice(-10)).toThrowError(
        "Preço não pode ser negativo",
      );
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
    });
  });
});
