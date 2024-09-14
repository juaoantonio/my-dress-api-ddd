import { Dress } from "@domain/dress/dress.aggregate";
import { DressId } from "@domain/dress/dress-id.vo";
import { describe, expect, it } from "vitest";

describe("Dress Aggregate Unit Tests", function () {
  describe("Dress Create Constructor", function () {
    it("should create a Dress with id", function () {
      const dress = new Dress({
        id: DressId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      expect(dress.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImageUrl()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);
      expect(dress.getModel()).toBe("Tomara que caia");
      expect(dress.getColor()).toBe("Marsala");
      expect(dress.getFabric()).toBe("Tule");

      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should create Dress without id", () => {
      const dress = new Dress({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      expect(dress.getId()).toBeDefined();
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImageUrl()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);

      expect(dress.notification.hasErrors()).toBe(false);
    });
  });

  describe("Dress Create Factory Method", function () {
    it("should create a Dress with id", function () {
      const dress = Dress.create({
        id: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      expect(dress.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImageUrl()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);

      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should create Dress without id", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      expect(dress.getId()).toBeDefined();
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImageUrl()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);

      expect(dress.notification.hasErrors()).toBe(false);
    });
  });

  describe("Dress Behavioral Methods", function () {
    it("should pickup a Dress", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      expect(dress.getIsPickedUp()).toBe(false);

      dress.pickUp();

      expect(dress.getIsPickedUp()).toBe(true);
      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should return a Dress", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      dress.pickUp();
      expect(dress.getIsPickedUp()).toBe(true);

      dress.returned();
      expect(dress.getIsPickedUp()).toBe(false);

      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should change price", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      expect(dress.getRentPrice()).toBe(100);
      dress.changeRentPrice(200);

      expect(dress.getRentPrice()).toBe(200);

      dress.changeRentPrice(200);
      expect(dress.getRentPrice()).toBe(200);

      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should change color", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      dress.changeColor("Azul");
      expect(dress.getColor()).toBe("Azul");
      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should change fabric", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      dress.changeFabric("Seda");
      expect(dress.getFabric()).toBe("Seda");
      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should change model", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      dress.changeModel("Com alça");
      expect(dress.getModel()).toBe("Com alça");
      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should change image url", () => {
      const dress = Dress.create({
        imageUrl: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      dress.changeImageUrl("https://teste.png");
      expect(dress.getImageUrl()).toBe("https://teste.png");

      expect(dress.notification.hasErrors()).toBe(false);
    });
  });

  describe("Dress Validation", function () {
    describe("Dress Create Validation", function () {
      const scenarios = [
        {
          data: {
            imageUrl: "",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          },
          errors: [
            {
              imageUrl: [
                "Url da imagem não pode ser vazia",
                "Url da imagem deve ser válida",
              ],
            },
          ],
        },
        {
          data: {
            imageUrl: "https://www.google.com",
            rentPrice: 0,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          },
          errors: [
            {
              rentPrice: ["Preço de aluguel deve ser positivo"],
            },
          ],
        },
        {
          data: {
            imageUrl: "https://www.google.com",
            rentPrice: -1,

            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          },
          errors: [
            {
              rentPrice: ["Preço de aluguel deve ser positivo"],
            },
          ],
        },
      ];
      it.each(scenarios)(
        "should validate the creation of a Dress",
        (scenario) => {
          const dress = Dress.create(scenario.data);
          expect(dress.notification).notificationContainsErrorMessages(
            scenario.errors,
          );
        },
      );
    });

    describe("Dress Change Validation", function () {
      describe("Dress Change Image Url", function () {
        it("should validate the change of a Dress Image Url", () => {
          const dress = Dress.create({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeImageUrl("");

          expect(dress.notification).notificationContainsErrorMessages([
            {
              imageUrl: [
                "Url da imagem não pode ser vazia",
                "Url da imagem deve ser válida",
              ],
            },
          ]);
          expect(dress.notification.hasErrors()).toBe(true);
        });

        it("should validate the change of a Dress Image Url", () => {
          const dress = Dress.create({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeImageUrl("https://teste.png");

          expect(dress.notification.hasErrors()).toBe(false);
        });
      });

      describe("Dress Change Rent Price", function () {
        it("should validate the change of a Dress Rent Price", () => {
          const dress = Dress.create({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeRentPrice(0);
          expect(dress.notification).notificationContainsErrorMessages([
            {
              rentPrice: ["Preço de aluguel deve ser positivo"],
            },
          ]);
          expect(dress.notification.hasErrors()).toBe(true);
        });

        it("should validate the change of a Dress Rent Price", () => {
          const dress = Dress.create({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeRentPrice(200);
          expect(dress.notification.hasErrors()).toBe(false);
        });
      });

      describe("Dress Change Color", function () {
        it("should validate the change of a invalid color", () => {
          const dress = Dress.create({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeColor("");
          expect(dress.notification).notificationContainsErrorMessages([
            {
              color: ["Cor não pode ser vazia"],
            },
          ]);
          expect(dress.notification.hasErrors()).toBe(true);
        });

        it("should validate the change of a valid color", () => {
          const dress = Dress.create({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeColor("Azul");
          expect(dress.notification.hasErrors()).toBe(false);
        });
      });

      describe("Dress Change Fabric", function () {
        it("should validate the change of a invalid fabric", () => {
          const dress = Dress.create({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeFabric("");
          expect(dress.notification).notificationContainsErrorMessages([
            {
              fabric: ["Tecido não pode ser vazio"],
            },
          ]);
          expect(dress.notification.hasErrors()).toBe(true);
        });

        it("should validate the change of a valid fabric", () => {
          const dress = Dress.create({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeFabric("Seda");
          expect(dress.notification.hasErrors()).toBe(false);
        });
      });

      describe("Dress Change Model", function () {
        it("should validate the change of a invalid model", () => {
          const dress = Dress.create({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeModel("");
          expect(dress.notification).notificationContainsErrorMessages([
            {
              model: ["Modelo não pode ser vazio"],
            },
          ]);
          expect(dress.notification.hasErrors()).toBe(true);
        });

        it("should validate the change of a valid model", () => {
          const dress = Dress.create({
            imageUrl: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeModel("Com alça");
          expect(dress.notification.hasErrors()).toBe(false);
        });
      });
    });
  });
});
