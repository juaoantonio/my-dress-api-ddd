import { describe, expect, it } from "vitest";
import { Dress } from "@domain/dress/Dress.entity";

describe("Dress Entity Unit Tests", function () {
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
});
