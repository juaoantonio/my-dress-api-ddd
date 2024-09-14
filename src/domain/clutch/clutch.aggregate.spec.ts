import { describe, expect, it } from "vitest";
import {
  Clutch,
  ClutchCreateCommandProps,
} from "@domain/clutch/clutch.aggregate";
import { ClutchId } from "@domain/clutch/clutch-id.vo";
import { ToJsonOutput } from "@domain/validators/notification.interface";

describe("Clutch Aggregate Unit Tests", function () {
  describe("Clutch Create Constructor", function () {
    it("should create a valid clutch", () => {
      const clutch = new Clutch({
        id: ClutchId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        imageUrl: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
      });

      expect(clutch.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(clutch.getImageUrl()).toBe("https://example.com/image.jpg");
      expect(clutch.getRentPrice()).toBe(100);
      expect(clutch.getModel()).toBe("Strass fecho de strass");
      expect(clutch.getColor()).toBe("Prata");
    });
  });

  describe("Clutch Create Factory Method", function () {
    it("should create a valid clutch", () => {
      const clutch = Clutch.create({
        id: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        imageUrl: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
      });

      expect(clutch.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(clutch.getImageUrl()).toBe("https://example.com/image.jpg");
      expect(clutch.getRentPrice()).toBe(100);
      expect(clutch.getModel()).toBe("Strass fecho de strass");
      expect(clutch.getColor()).toBe("Prata");
    });

    it("should create a valid clutch without id", () => {
      const clutch = Clutch.create({
        imageUrl: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
      });

      expect(clutch.getId().getValue()).not.toBe(null);
      expect(clutch.getImageUrl()).toBe("https://example.com/image.jpg");
      expect(clutch.getRentPrice()).toBe(100);
      expect(clutch.getModel()).toBe("Strass fecho de strass");
      expect(clutch.getColor()).toBe("Prata");
    });
  });

  describe("Clutch Behavior Methods", function () {
    it("should pickup a purse", () => {
      const clutch = new Clutch({
        id: ClutchId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        imageUrl: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
      });

      clutch.pickUp();
      expect(clutch.getIsPickedUp()).toBe(true);
    });

    it("should return a purse", () => {
      const clutch = new Clutch({
        id: ClutchId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        imageUrl: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
        isPickedUp: true,
      });

      clutch.return();
      expect(clutch.getIsPickedUp()).toBe(false);
    });
  });

  describe("Clutch Validation", function () {
    describe("Validate Clutch Creation", function () {
      const scenarios: {
        data: ClutchCreateCommandProps;
        errors: ToJsonOutput;
      }[] = [
        {
          data: {
            imageUrl: "",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
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
            rentPrice: 200,
            color: "",
            model: "",
          },
          errors: [
            {
              color: ["Cor não pode ser vazia"],
              model: ["Modelo não pode ser vazio"],
            },
          ],
        },
      ];

      it.each(scenarios)(
        "should validate the creation of a Clutch",
        ({ data, errors }) => {
          const clutch = Clutch.create(data);
          expect(clutch.notification).notificationContainsErrorMessages(errors);
        },
      );
    });

    describe("Validate Clutch Behavior Methods", function () {
      describe("Validate Change Image Url", function () {
        it("should validate valid imageUrl", () => {
          const clutch = Clutch.create({
            imageUrl: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeImageUrl("https://example.com/image2.jpg");
          expect(clutch.notification.hasErrors()).toBe(false);
        });

        it("should validate invalid imageUrl", () => {
          const clutch = Clutch.create({
            imageUrl: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeImageUrl("");
          expect(clutch.notification).notificationContainsErrorMessages([
            {
              imageUrl: [
                "Url da imagem não pode ser vazia",
                "Url da imagem deve ser válida",
              ],
            },
          ]);
          expect(clutch.notification.hasErrors()).toBe(true);
        });
      });

      describe("Validate Change Rent Price", function () {
        it("should validate valid rent price", () => {
          const clutch = Clutch.create({
            imageUrl: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeRentPrice(200);
          expect(clutch.notification.hasErrors()).toBe(false);
        });

        it("should validate invalid rent price", () => {
          const clutch = Clutch.create({
            imageUrl: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeRentPrice(0);
          expect(clutch.notification).notificationContainsErrorMessages([
            {
              rentPrice: ["Preço de aluguel deve ser positivo"],
            },
          ]);
          expect(clutch.notification.hasErrors()).toBe(true);

          clutch.changeRentPrice(-1);
          expect(clutch.notification).notificationContainsErrorMessages([
            {
              rentPrice: ["Preço de aluguel deve ser positivo"],
            },
          ]);
        });
      });

      describe("Validate Change Color", function () {
        it("should validate valid color", () => {
          const clutch = Clutch.create({
            imageUrl: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeColor("Azul");
          expect(clutch.notification.hasErrors()).toBe(false);
        });

        it("should validate invalid color", () => {
          const clutch = Clutch.create({
            imageUrl: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeColor("");
          expect(clutch.notification).notificationContainsErrorMessages([
            {
              color: ["Cor não pode ser vazia"],
            },
          ]);
          expect(clutch.notification.hasErrors()).toBe(true);
        });
      });

      describe("Validate Change Model", function () {
        it("should validate valid model", () => {
          const clutch = Clutch.create({
            imageUrl: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeModel("Strass fecho de strass 2");
          expect(clutch.notification.hasErrors()).toBe(false);
        });

        it("should validate invalid model", () => {
          const clutch = Clutch.create({
            imageUrl: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeModel("");
          expect(clutch.notification).notificationContainsErrorMessages([
            {
              model: ["Modelo não pode ser vazio"],
            },
          ]);
          expect(clutch.notification.hasErrors()).toBe(true);
        });
      });
    });
  });
});
