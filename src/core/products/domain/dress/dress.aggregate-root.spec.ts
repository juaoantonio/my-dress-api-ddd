import { Dress } from "./dress.aggregate-root";
import { DressId } from "./dress-id.vo";
import { describe, expect, it } from "vitest";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { Period } from "@core/@shared/domain/value-objects/period.vo";

describe("Dress Aggregate Unit Tests", function () {
  describe("Dress Create Constructor", function () {
    it("should create a Dress with id", function () {
      const dress = new Dress({
        id: DressId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        imagePath: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      expect(dress.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImagePath()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);
      expect(dress.getModel()).toBe("Tomara que caia");
      expect(dress.getColor()).toBe("Marsala");
      expect(dress.getFabric()).toBe("Tule");
      expect(dress.notification.hasErrors()).toBe(false);
      expect(dress.getReservationPeriods()).toEqual([]);

      expect(dress.notification.hasErrors()).toBe(false);
    });
  });

  describe("Dress Create Factory Method", function () {
    it("should create a Dress with id", function () {
      const dress = Dress.create({
        id: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        imagePath: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      expect(dress.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImagePath()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);
      expect(dress.getReservationPeriods()).toEqual([]);
      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should create Dress without id", () => {
      const dress = Dress.create({
        imagePath: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      expect(dress.getId()).toBeDefined();
      expect(dress.getName()).toBe("Marsala, Tomara que caia, Tule");
      expect(dress.getImagePath()).toBe("https://www.google.com");
      expect(dress.getIsPickedUp()).toBe(false);
      expect(dress.getRentPrice()).toBe(100);
      expect(dress.getReservationPeriods()).toEqual([]);
      expect(dress.notification.hasErrors()).toBe(false);
    });
  });

  describe("Dress Behavioral Methods", function () {
    it("should pickup a Dress", () => {
      const dress = Dress.create({
        imagePath: "https://www.google.com",
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
        imagePath: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      dress.pickUp();
      expect(dress.getIsPickedUp()).toBe(true);

      dress.return();
      expect(dress.getIsPickedUp()).toBe(false);

      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should change price", () => {
      const dress = Dress.create({
        imagePath: "https://www.google.com",
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
        imagePath: "https://www.google.com",
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
        imagePath: "https://www.google.com",
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
        imagePath: "https://www.google.com",
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
        imagePath: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
      });

      dress.changeImagePath("https://teste.png");
      expect(dress.getImagePath()).toBe("https://teste.png");

      expect(dress.notification.hasErrors()).toBe(false);
    });

    it("should check if a dress is available for rent in a specific date range", () => {
      const dress = new Dress({
        id: DressId.random(),
        imagePath: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
        isPickedUp: false,
        reservationPeriods: [
          new Period({
            startDate: DateVo.create("2022-01-10"),
            endDate: DateVo.create("2022-01-20"),
          }),
          new Period({
            startDate: DateVo.create("2022-01-25"),
            endDate: DateVo.create("2022-01-30"),
          }),
        ],
      });

      const dateToCheck = DateVo.create("2022-01-15");
      expect(dress.isAvailableFor(dateToCheck)).toBe(false);

      const dateToCheck2 = DateVo.create("2022-01-22");
      expect(dress.isAvailableFor(dateToCheck2)).toBe(true);

      const dateToCheck3 = DateVo.create("2022-01-30");
      expect(dress.isAvailableFor(dateToCheck3)).toBe(false);

      const dateToCheck4 = DateVo.create("2022-01-05");
      expect(dress.isAvailableFor(dateToCheck4)).toBe(true);
    });

    it("should add a reservation period", () => {
      const dress = new Dress({
        id: DressId.random(),
        imagePath: "https://www.google.com",
        rentPrice: 100,
        color: "Marsala",
        model: "Tomara que caia",
        fabric: "Tule",
        isPickedUp: false,
        reservationPeriods: [],
      });

      const period = new Period({
        startDate: DateVo.create("2022-01-10"),
        endDate: DateVo.create("2022-01-20"),
      });

      dress.addReservationPeriod(period);
      expect(dress.getReservationPeriods()).toEqual([period]);
    });
  });

  describe("Dress Validation", function () {
    describe("Dress Create Validation", function () {
      const scenarios = [
        {
          data: {
            imagePath: "",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
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
            imagePath: "https://www.google.com",
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
            imagePath: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeImagePath("");

          expect(dress.notification).notificationContainsErrorMessages([
            {
              imagePath: ["Path da imagem não pode ser vazio"],
            },
          ]);
          expect(dress.notification.hasErrors()).toBe(true);
        });

        it("should validate the change of a Dress Image Url", () => {
          const dress = Dress.create({
            imagePath: "https://www.google.com",
            rentPrice: 100,
            color: "Marsala",
            model: "Tomara que caia",
            fabric: "Tule",
          });

          dress.changeImagePath("https://teste.png");
          console.log(dress.notification);
          expect(dress.notification.hasErrors()).toBe(false);
        });
      });

      describe("Dress Change Rent Price", function () {
        it("should validate the change of a Dress Rent Price", () => {
          const dress = Dress.create({
            imagePath: "https://www.google.com",
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
            imagePath: "https://www.google.com",
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
            imagePath: "https://www.google.com",
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
            imagePath: "https://www.google.com",
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
            imagePath: "https://www.google.com",
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
            imagePath: "https://www.google.com",
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
            imagePath: "https://www.google.com",
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
            imagePath: "https://www.google.com",
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
