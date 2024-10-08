import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { v4 as uuidv4 } from "uuid";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { DressId } from "@core/products/domain/dress/dress-id.vo";

describe("DressTypeormRepository Integration Test", () => {
  let repository: DressTypeormRepository;
  const setup = setupTypeOrmForIntegrationTests({
    entities: [DressModel],
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-10-01T00:00:00.000Z"));

    const modelRepository = setup.dataSource.getRepository(DressModel);
    repository = new DressTypeormRepository(modelRepository);
  });

  describe("getAllAvailableForPeriod", () => {
    it("should return all dresses available for the given period", async () => {
      const dress1 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress1.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const dress2 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress2.png",
        model: "Casual Dress",
        color: "Blue",
        fabric: "Cotton",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([dress1, dress2]);

      const period = new Period({
        startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
        endDate: DateVo.create("2024-10-05T00:00:00.000Z"),
      });

      const availableDresses =
        await repository.getAllAvailableForPeriod(period);
      expect(availableDresses).toHaveLength(2);
      expect(availableDresses[0].equals(dress1)).toBe(true);
      expect(availableDresses[1].equals(dress2)).toBe(true);
    });

    it("should return an empty array when no dresses are available for the given period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-01T00:00:00.000Z").toISOString(),
            endDate: new Date("2024-10-10T00:00:00.000Z").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
        endDate: DateVo.create("2024-10-05T00:00:00.000Z"),
      });

      const availableDresses =
        await repository.getAllAvailableForPeriod(period);
      expect(availableDresses).toHaveLength(0);
    });
  });

  describe("getAllNotAvailableForPeriod", () => {
    it("should return all dresses not available for the given period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-01T00:00:00.000Z").toISOString(),
            endDate: new Date("2024-10-10T00:00:00.000Z").toISOString(),
          },
        ],
      });
      await repository.save(dress);
      const period = new Period({
        startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
        endDate: DateVo.create("2024-10-05T00:00:00.000Z"),
      });
      const unavailableDresses =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableDresses).toHaveLength(1);
      expect(unavailableDresses[0].equals(dress)).toBe(true);
    });

    it("should return an empty array when all dresses are available for the given period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
        endDate: DateVo.create("2024-10-05T00:00:00.000Z"),
      });

      const unavailableDresses =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableDresses).toHaveLength(0);
    });
  });

  describe("save", () => {
    it("should save a dress entity successfully", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(dress);
      const savedDress = await repository.findById(dress.getId());
      expect(savedDress?.equals(dress)).toBe(true);
    });
  });

  describe("delete", () => {
    it("should delete a dress entity successfully", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });
      await repository.save(dress);
      await repository.delete(dress.getId());
      const deletedDress = await repository.findById(dress.getId());
      expect(deletedDress).toBeNull();
    });
  });

  describe("existsById", () => {
    it("should correctly identify existing and non-existing dress ids", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(dress);

      const result = await repository.existsById([
        dress.getId(),
        DressId.random(),
      ]);
      expect(result.exists).toContainEqual(dress.getId());
      expect(result.notExists).toHaveLength(1);
    });
  });
});
