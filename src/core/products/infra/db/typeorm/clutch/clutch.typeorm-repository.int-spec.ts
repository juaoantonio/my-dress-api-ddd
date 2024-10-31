import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { ClutchTypeormRepository } from "@core/products/infra/db/typeorm/clutch/clutch.typeorm-repository";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { v4 as uuidv4 } from "uuid";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import {
  ClutchSearchParams,
  ClutchSearchResult,
} from "@core/products/domain/clutch/clutch.repository";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InvalidSearchParamsError } from "@core/@shared/domain/error/invalid-search-params.error";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BookingItemClutchModel } from "@core/booking/infra/db/typeorm/booking-item-clutch.model";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { BookingItemDressModel } from "@core/booking/infra/db/typeorm/booking-item-dress.model";
import { Booking } from "@core/booking/domain/booking.aggregate-root";
import { BookingPeriod } from "@core/booking/domain/booking-period.vo";
import { BookingTypeormRepository } from "@core/booking/infra/db/typeorm/booking.typeorm-repository";
import { BookingClutchItem } from "@core/booking/domain/entities/booking-clutch-item.entity";

describe("ClutchTypeormRepository Integration Test", async () => {
  let clutchRepository: ClutchTypeormRepository;
  let bookingRepository: BookingTypeormRepository;
  const container = await new PostgreSqlContainer().start();
  const setup = setupTypeOrmForIntegrationTests({
    type: "postgres",
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    entities: [
      BookingModel,
      DressModel,
      BookingItemDressModel,
      ClutchModel,
      BookingItemClutchModel,
    ],
  });

  beforeEach(async () => {
    const modelRepository = setup.dataSource.getRepository(ClutchModel);
    clutchRepository = new ClutchTypeormRepository(modelRepository);
    const bookingModelRepository = setup.dataSource.getRepository(BookingModel);
    bookingRepository = new BookingTypeormRepository(bookingModelRepository);
  });

  describe("search", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-10-01T00:00:00.000Z"));
    });
    // **Testes para Disponíveis (`available: true`)**

    it("should return all available clutches when no reservation periods are set", async () => {
      const clutch1 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch1.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
      });

      const clutch2 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch2.png",
        model: "Casual Clutch",
        color: "Blue",
        rentPrice: 150.0,
        isPickedUp: false,
      });

      await clutchRepository.saveMany([clutch1, clutch2]);

      const searchParams = ClutchSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-01T00:00:00.000Z",
          endDate: "2024-10-05T00:00:00.000Z",
        },
      });

      const searchResult: ClutchSearchResult =
        await clutchRepository.search(searchParams);

      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(clutch1);
      expect(searchResult.items).toContainEqual(clutch2);
      expect(searchResult.total).toBe(2);
      expect(searchResult.currentPage).toBe(1);
      expect(searchResult.perPage).toBe(15);
    });

    it("should return available clutches when reservations do not overlap with the requested period", async () => {
      const clutch1 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch1.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
      });

      const clutch2 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch2.png",
        model: "Casual Clutch",
        color: "Blue",
        rentPrice: 150.0,
        isPickedUp: false,
      });

      await clutchRepository.saveMany([clutch1, clutch2]);

      const searchParams = ClutchSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-05T00:00:00.000Z",
          endDate: "2024-10-09T00:00:00.000Z",
        },
      });

      const searchResult: ClutchSearchResult =
        await clutchRepository.search(searchParams);

      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(clutch1);
      expect(searchResult.items).toContainEqual(clutch2);
      expect(searchResult.total).toBe(2);
    });

    it("should return unavailable clutches for the given period when available=false", async () => {
      const clutch1 = Clutch.fake().aClutch().build();
      const clutch2 = Clutch.fake().aClutch().build();
      await clutchRepository.saveMany([clutch1, clutch2]);
      const overlappingBooking = Booking.fake()
        .aBooking()
        .withExpectedBookingPeriod(
          new BookingPeriod({
            pickUpDate: DateVo.create("2024-10-09T00:00:00.000Z"),
            returnDate: DateVo.create("2024-10-11T00:00:00.000Z"),
          }),
        )
        .build();
      const clutchItem1 = BookingClutchItem.fake()
        .aClutchItem()
        .withProductId(clutch1.getId().getValue())
        .build();
      const clutchItem2 = BookingClutchItem.fake()
        .aClutchItem()
        .withProductId(clutch2.getId().getValue())
        .build();
      overlappingBooking.addManyItems([clutchItem1, clutchItem2]);
      await bookingRepository.save(overlappingBooking);
      const searchParams = ClutchSearchParams.create({
        filter: {
          available: false,
          startDate: "2024-10-09T00:00:00.000Z",
          endDate: "2024-10-11T00:00:00.000Z",
        },
      });
      const searchResult: ClutchSearchResult =
        await clutchRepository.search(searchParams);
      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainWithCondition((item) =>
        item.equals(clutch1),
      );
      expect(searchResult.items).toContainWithCondition((item) =>
        item.equals(clutch2),
      );
      expect(searchResult.total).toBe(2);
    });

    it("should handle period boundaries correctly for available=true", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
      });

      await clutchRepository.save(clutch);

      const searchParams1 = ClutchSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-05T00:00:00.000Z",
          endDate: "2024-10-09T00:00:00.000Z",
        },
      });

      const searchResult1: ClutchSearchResult =
        await clutchRepository.search(searchParams1);
      expect(searchResult1.items).toHaveLength(1);
      expect(searchResult1.items[0].equals(clutch)).toBe(true);

      const searchParams2 = ClutchSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-16T00:00:00.000Z",
          endDate: "2024-10-20T00:00:00.000Z",
        },
      });

      const searchResult2: ClutchSearchResult =
        await clutchRepository.search(searchParams2);
      expect(searchResult2.items).toHaveLength(1);
      expect(searchResult2.items[0].equals(clutch)).toBe(true);
    });

    it("should throw InvalidSearchParamsError when available=true but period dates are missing", () => {
      expect(() =>
        ClutchSearchParams.create({
          filter: {
            available: true,
            // startDate e endDate estão faltando
          },
        }),
      ).toThrow(InvalidSearchParamsError);
    });

    it("should create a new instance with available=false and period provided", () => {
      const searchParams = ClutchSearchParams.create({
        filter: {
          available: false,
          startDate: "2024-11-01T00:00:00.000Z",
          endDate: "2024-11-10T00:00:00.000Z",
        },
        page: 4,
        perPage: 25,
        sort: "fabric",
        sortDir: "desc",
      });

      expect(searchParams).toBeInstanceOf(ClutchSearchParams);
      expect(searchParams.filter).toEqual({
        available: false,
        period: Period.create({
          startDate: DateVo.create("2024-11-01T00:00:00.000Z"),
          endDate: DateVo.create("2024-11-10T00:00:00.000Z"),
        }),
      });
      expect(searchParams.page).toBe(4);
      expect(searchParams.perPage).toBe(25);
      expect(searchParams.sort).toBe("fabric");
      expect(searchParams.sortDir).toBe("desc");
    });

    it("should create a new instance with partial valid filter values including available and period", () => {
      const searchParams = ClutchSearchParams.create({
        filter: {
          model: "Summer Clutch",
          available: true,
          startDate: "2024-10-01T00:00:00.000Z",
          endDate: "2024-10-15T00:00:00.000Z",
        },
        page: 2,
        perPage: 10,
        sort: "model",
        sortDir: "desc",
      });

      expect(searchParams).toBeInstanceOf(ClutchSearchParams);
      expect(searchParams.filter).toEqual({
        model: "Summer Clutch",
        available: true,
        period: Period.create({
          startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
          endDate: DateVo.create("2024-10-15T00:00:00.000Z"),
        }),
      });
      expect(searchParams.page).toBe(2);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBe("model");
      expect(searchParams.sortDir).toBe("desc");
    });
  });

  // **Testes de Salvar, Deletar, e Existência**

  describe("save", () => {
    it("should save a clutch entity successfully", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
      });

      await clutchRepository.save(clutch);
      const savedClutch = await clutchRepository.findById(clutch.getId());
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
      });

      await clutchRepository.save(clutch);
      await clutchRepository.delete(clutch.getId());
      const deletedClutch = await clutchRepository.findById(clutch.getId());
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
      });

      await clutchRepository.save(clutch);

      const result = await clutchRepository.existsById([
        clutch.getId(),
        ClutchId.random(),
      ]);
      expect(result.exists).toContainEqual(clutch.getId());
      expect(result.notExists).toHaveLength(1);
    });
  });
});
