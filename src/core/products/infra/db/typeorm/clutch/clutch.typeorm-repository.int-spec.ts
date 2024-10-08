import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { ClutchTypeormRepository } from "@core/products/infra/db/typeorm/clutch/clutch.typeorm-repository";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { v4 as uuidv4 } from "uuid";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";

describe("ClutchTypeormRepository Integration Test", () => {
  let repository: ClutchTypeormRepository;
  const setup = setupTypeOrmForIntegrationTests({
    entities: [ClutchModel],
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-10-01T00:00:00.000Z"));

    const modelRepository = setup.dataSource.getRepository(ClutchModel);
    repository = new ClutchTypeormRepository(modelRepository);
  });

  describe("getAllAvailableForPeriod", () => {
    it("should return all clutches available for the given period", async () => {
      const clutch1 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch1.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const clutch2 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch2.png",
        model: "Casual Clutch",
        color: "Blue",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([clutch1, clutch2]);

      const period = new Period({
        startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
        endDate: DateVo.create("2024-10-05T00:00:00.000Z"),
      });

      const availableClutches =
        await repository.getAllAvailableForPeriod(period);
      expect(availableClutches).toHaveLength(2);
      expect(availableClutches[0].equals(clutch1)).toBe(true);
      expect(availableClutches[1].equals(clutch2)).toBe(true);
    });

    it("should return an empty array when no clutches are available for the given period", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-01T00:00:00.000Z").toISOString(),
            endDate: new Date("2024-10-10T00:00:00.000Z").toISOString(),
          },
        ],
      });

      await repository.save(clutch);

      const period = new Period({
        startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
        endDate: DateVo.create("2024-10-05T00:00:00.000Z"),
      });

      const availableClutches =
        await repository.getAllAvailableForPeriod(period);
      expect(availableClutches).toHaveLength(0);
    });
  });

  describe("getAllNotAvailableForPeriod", () => {
    it("should return all clutches not available for the given period", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-01T00:00:00.000Z").toISOString(),
            endDate: new Date("2024-10-10T00:00:00.000Z").toISOString(),
          },
        ],
      });

      await repository.save(clutch);

      const period = new Period({
        startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
        endDate: DateVo.create("2024-10-05T00:00:00.000Z"),
      });

      const unavailableClutches =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableClutches).toHaveLength(1);
      expect(unavailableClutches[0].equals(clutch)).toBe(true);
    });

    it("should return an empty array when all clutches are available for the given period", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(clutch);

      const period = new Period({
        startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
        endDate: DateVo.create("2024-10-05T00:00:00.000Z"),
      });

      const unavailableClutches =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableClutches).toHaveLength(0);
    });
  });

  describe("save", () => {
    it("should save a clutch entity successfully", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(clutch);
      const savedClutch = await repository.findById(clutch.getId());
      expect(savedClutch?.equals(clutch)).toBe(true);
    });
  });

  describe("delete", () => {
    it("should delete a clutch entity successfully", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(clutch);
      await repository.delete(clutch.getId());
      const deletedClutch = await repository.findById(clutch.getId());
      expect(deletedClutch).toBeNull();
    });
  });

  describe("existsById", () => {
    it("should correctly identify existing and non-existing clutch ids", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(clutch);

      const result = await repository.existsById([
        clutch.getId(),
        ClutchId.random(),
      ]);
      expect(result.exists).toContainEqual(clutch.getId());
      expect(result.notExists).toHaveLength(1);
    });
  });
});
