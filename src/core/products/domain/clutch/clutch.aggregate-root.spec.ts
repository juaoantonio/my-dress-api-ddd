import { Clutch, ClutchCreateCommandProps } from "./clutch.aggregate-root";
import { ClutchId } from "./clutch-id.vo";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { expect, it } from "vitest";
import { ClutchFakeBuilder } from "@core/products/domain/clutch/clutch-fake.builder";
import { FieldsErrors } from "@core/@shared/domain/validators/validator-fields.interface";

describe("Clutch Aggregate Unit Tests", function () {
  it("should have fake static method", () => {
    expect(Clutch.fake).toBeDefined();
    expect(Clutch.fake()).toBe(ClutchFakeBuilder);
  });
  describe("Clutch Create Constructor", function () {
    it("should create a valid clutch", () => {
      const clutch = new Clutch({
        id: ClutchId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        imagePath: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
      });

      expect(clutch.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(clutch.getImagePath()).toBe("https://example.com/image.jpg");
      expect(clutch.getRentPrice()).toBe(100);
      expect(clutch.getModel()).toBe("Strass fecho de strass");
      expect(clutch.getColor()).toBe("Prata");
    });
  });

  describe("Clutch Create Factory Method", function () {
    it("should create a valid clutch", () => {
      const clutch = Clutch.create({
        id: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        imagePath: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
      });

      expect(clutch.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(clutch.getImagePath()).toBe("https://example.com/image.jpg");
      expect(clutch.getRentPrice()).toBe(100);
      expect(clutch.getModel()).toBe("Strass fecho de strass");
      expect(clutch.getColor()).toBe("Prata");
    });

    it("should create a valid clutch without id", () => {
      const clutch = Clutch.create({
        imagePath: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
      });

      expect(clutch.getId().getValue()).not.toBe(null);
      expect(clutch.getImagePath()).toBe("https://example.com/image.jpg");
      expect(clutch.getRentPrice()).toBe(100);
      expect(clutch.getModel()).toBe("Strass fecho de strass");
      expect(clutch.getColor()).toBe("Prata");
    });
  });

  describe("Clutch Behavior Methods", function () {
    it("should pickup a purse", () => {
      const clutch = new Clutch({
        id: ClutchId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        imagePath: "https://example.com/image.jpg",
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
        imagePath: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
        isPickedUp: true,
      });

      clutch.return();
      expect(clutch.getIsPickedUp()).toBe(false);
    });

    it("should add a reservation period", () => {
      const clutch = new Clutch({
        id: ClutchId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        imagePath: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
      });

      const period = new Period({
        startDate: DateVo.create("2021-10-10"),
        endDate: DateVo.create("2021-10-20"),
      });
      clutch.addReservationPeriod(period);
      expect(clutch.getReservationPeriods()).toContain(period);
    });

    it("should check if a dress is available for rent in a specific date range", () => {
      const clutch = new Clutch({
        id: ClutchId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        imagePath: "https://example.com/image.jpg",
        rentPrice: 100,
        model: "Strass fecho de strass",
        color: "Prata",
        reservationPeriods: [
          new Period({
            startDate: DateVo.create("2021-10-10"),
            endDate: DateVo.create("2021-10-20"),
          }),
          new Period({
            startDate: DateVo.create("2021-10-25"),
            endDate: DateVo.create("2021-10-27"),
          }),
        ],
      });

      const date = DateVo.create("2021-10-15");
      expect(clutch.isAvailableForDate(date)).toBe(false);

      const date2 = DateVo.create("2021-10-22");
      expect(clutch.isAvailableForDate(date2)).toBe(true);

      const date3 = DateVo.create("2021-10-27");
      expect(clutch.isAvailableForDate(date3)).toBe(false);
    });
  });

  describe("Clutch Validation", function () {
    describe("Validate Clutch Creation", function () {
      const scenarios: {
        data: ClutchCreateCommandProps;
        errors: FieldsErrors[];
      }[] = [
        {
          data: {
            imagePath: "",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          },
          errors: [
            {
              imagePath: ["Path da imagem não pode ser vazio"],
            },
          ],
        },
        {
          data: {
            imagePath: "https://www.google.com",
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
            imagePath: "https://www.google.com",
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
            imagePath: "https://www.google.com",
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
      describe("Validate Change Image Path", function () {
        it("should validate valid imagePath", () => {
          const clutch = Clutch.create({
            imagePath: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeImagePath("https://example.com/image2.jpg");
          expect(clutch.notification.hasErrors()).toBe(false);
        });

        it("should validate invalid imagePath", () => {
          const clutch = Clutch.create({
            imagePath: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeImagePath("");
          expect(clutch.notification).notificationContainsErrorMessages([
            {
              imagePath: ["Path da imagem não pode ser vazio"],
            },
          ]);
          expect(clutch.notification.hasErrors()).toBe(true);
        });
      });

      describe("Validate Change Rent Price", function () {
        it("should validate valid rent price", () => {
          const clutch = Clutch.create({
            imagePath: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeRentPrice(200);
          expect(clutch.notification.hasErrors()).toBe(false);
        });

        it("should validate invalid rent price", () => {
          const clutch = Clutch.create({
            imagePath: "https://example.com/image.jpg",
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
            imagePath: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeColor("Azul");
          expect(clutch.notification.hasErrors()).toBe(false);
        });

        it("should validate invalid color", () => {
          const clutch = Clutch.create({
            imagePath: "https://example.com/image.jpg",
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
            imagePath: "https://example.com/image.jpg",
            rentPrice: 100,
            model: "Strass fecho de strass",
            color: "Prata",
          });

          clutch.changeModel("Strass fecho de strass 2");
          expect(clutch.notification.hasErrors()).toBe(false);
        });

        it("should validate invalid model", () => {
          const clutch = Clutch.create({
            imagePath: "https://example.com/image.jpg",
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
