import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { v4 as uuidv4 } from "uuid";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import {
  DressSearchParams,
  DressSearchResult,
} from "@core/products/domain/dress/dress.repository";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BookingItemDressModel } from "@core/booking/infra/db/typeorm/booking-item-dress.model";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { BookingItemClutchModel } from "@core/booking/infra/db/typeorm/booking-item-clutch.model";
import { BookingTypeormRepository } from "@core/booking/infra/db/typeorm/booking.typeorm-repository";
import { Booking } from "@core/booking/domain/booking.aggregate-root";
import { BookingDressItem } from "@core/booking/domain/entities/booking-dress-item.entity";
import { BookingPeriod } from "@core/booking/domain/booking-period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { Period } from "@core/@shared/domain/value-objects/period.vo";

describe("DressTypeormRepository Integration Test", async () => {
  let dressRepository: DressTypeormRepository;
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
    const modelRepository = setup.dataSource.getRepository(DressModel);
    dressRepository = new DressTypeormRepository(modelRepository);
    bookingRepository = new BookingTypeormRepository(
      setup.dataSource.getRepository(BookingModel),
    );
  });

  afterAll(async () => {
    await setup.dataSource.destroy();
    await container.stop();
  });

  describe("search", () => {
    // **Testes para Disponíveis (`available: true`)**
    beforeEach(async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-09-30T00:00:00.000Z"));
    });

    it("should return all available dresses when no reservation periods are set", async () => {
      const dresses = Dress.fake()
        .theDresses(2)
        .withReservationPeriods([])
        .build();
      await dressRepository.saveMany(dresses);

      const searchParams = DressSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-01T00:00:00.000Z",
          endDate: "2024-10-05T00:00:00.000Z",
        },
      });
      const searchResult: DressSearchResult =
        await dressRepository.search(searchParams);
      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(dresses[0]);
      expect(searchResult.items).toContainEqual(dresses[1]);
      expect(searchResult.total).toBe(2);
      expect(searchResult.currentPage).toBe(1);
      expect(searchResult.perPage).toBe(15); // Valor padrão
    });

    it("should return available dresses when reservations do not overlap with the requested period", async () => {
      const dresses = Dress.fake()
        .theDresses(2)
        .withId((index) =>
          DressId.create(`19481bbf-a294-4316-953d-f718270a2bc${index}`),
        )
        .build();
      const booking = Booking.fake()
        .aBooking()
        .withExpectedBookingPeriod(
          new BookingPeriod({
            pickUpDate: DateVo.create("2024-10-05T00:00:00.000Z"),
            returnDate: DateVo.create("2024-10-09T00:00:00.000Z"),
          }),
        )
        .build();
      const dressBookingItems = BookingDressItem.fake()
        .theDressItems(2)
        .withProductId((index) => `19481bbf-a294-4316-953d-f718270a2bc${index}`)
        .build();
      booking.addManyItems(dressBookingItems);
      await dressRepository.saveMany(dresses);
      await bookingRepository.save(booking);
      const searchParams = DressSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-10T00:00:00.000Z",
          endDate: "2024-10-15T00:00:00.000Z",
        },
      });
      const searchResult: DressSearchResult =
        await dressRepository.search(searchParams);
      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.total).toBe(2);
      searchResult.items.forEach((dress) => {
        expect(dress.getReservationPeriods()).toStrictEqual([
          new Period({
            startDate: DateVo.create("2024-10-05T00:00:00.000Z"),
            endDate: DateVo.create("2024-10-09T00:00:00.000Z"),
          }),
        ]);
      });
    });

    it("should return only dresses without overlapping reservations for available=true", async () => {
      const dress1 = Dress.fake()
        .aDress()
        .withId(DressId.create("19481bbf-a294-4316-953d-f718270a2bc1"))
        .build();
      const dress2 = Dress.fake()
        .aDress()
        .withId(DressId.create("19481bbf-a294-4316-953d-f718270a2bc2"))
        .build();
      await dressRepository.saveMany([dress1, dress2]);
      const overlapingBooking = Booking.fake()
        .aBooking()
        .withExpectedBookingPeriod(
          new BookingPeriod({
            pickUpDate: DateVo.create("2024-10-05T00:00:00.000Z"),
            returnDate: DateVo.create("2024-10-09T00:00:00.000Z"),
          }),
        )
        .build();
      const nonOverlapingBooking = Booking.fake()
        .aBooking()
        .withExpectedBookingPeriod(
          new BookingPeriod({
            pickUpDate: DateVo.create("2024-10-10T00:00:00.000Z"),
            returnDate: DateVo.create("2024-10-15T00:00:00.000Z"),
          }),
        )
        .build();
      const dressBookingItem1 = BookingDressItem.fake()
        .aDressItem()
        .withProductId(`19481bbf-a294-4316-953d-f718270a2bc1`)
        .build();
      const dressBookingItem2 = BookingDressItem.fake()
        .aDressItem()
        .withProductId(`19481bbf-a294-4316-953d-f718270a2bc2`)
        .build();
      overlapingBooking.addItem(dressBookingItem1);
      nonOverlapingBooking.addItem(dressBookingItem2);
      await bookingRepository.saveMany([
        overlapingBooking,
        nonOverlapingBooking,
      ]);
      const searchParams = DressSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-05T00:00:00.000Z",
          endDate: "2024-10-09T00:00:00.000Z",
        },
      });
      const searchResult: DressSearchResult =
        await dressRepository.search(searchParams);
      expect(searchResult.items).toHaveLength(1);
      expect(searchResult.items[0].getId()).toStrictEqual(dress2.getId());
    });

    it("should return unavailable dresses for the given period when available=false", async () => {
      const dresses = Dress.fake().theDresses(2).build();
      await dressRepository.saveMany(dresses);

      const overlappingBooking = Booking.fake()
        .aBooking()
        .withExpectedBookingPeriod(
          new BookingPeriod({
            pickUpDate: DateVo.create("2024-10-10T00:00:00.000Z"),
            returnDate: DateVo.create("2024-10-15T00:00:00.000Z"),
          }),
        )
        .build();

      const dressBookingItem = BookingDressItem.fake()
        .aDressItem()
        .withProductId(dresses[0].getId().getValue())
        .build();

      overlappingBooking.addItem(dressBookingItem);
      await bookingRepository.save(overlappingBooking);

      const searchParams = DressSearchParams.create({
        filter: {
          available: false,
          startDate: "2024-10-12T00:00:00.000Z",
          endDate: "2024-10-18T00:00:00.000Z",
        },
      });
      const searchResult: DressSearchResult =
        await dressRepository.search(searchParams);

      expect(searchResult.items).toHaveLength(1);
      expect(searchResult.items[0].equals(dresses[0])).toBe(true);
      expect(searchResult.total).toBe(1);
    });

    it("should return multiple unavailable dresses for overlapping periods", async () => {
      const dresses = Dress.fake().theDresses(2).build();
      await dressRepository.saveMany(dresses);

      const booking1 = Booking.fake()
        .aBooking()
        .withExpectedBookingPeriod(
          new BookingPeriod({
            pickUpDate: DateVo.create("2024-10-09T00:00:00.000Z"),
            returnDate: DateVo.create("2024-10-10T00:00:00.000Z"),
          }),
        )
        .build();

      const booking2 = Booking.fake()
        .aBooking()
        .withExpectedBookingPeriod(
          new BookingPeriod({
            pickUpDate: DateVo.create("2024-10-09T00:00:00.000Z"),
            returnDate: DateVo.create("2024-10-10T00:00:00.000Z"),
          }),
        )
        .build();

      const dressBookingItem1 = BookingDressItem.fake()
        .aDressItem()
        .withProductId(dresses[0].getId().getValue())
        .build();
      const dressBookingItem2 = BookingDressItem.fake()
        .aDressItem()
        .withProductId(dresses[1].getId().getValue())
        .build();

      booking1.addItem(dressBookingItem1);
      booking2.addItem(dressBookingItem2);
      await bookingRepository.saveMany([booking1, booking2]);

      const searchParams = DressSearchParams.create({
        filter: {
          available: false,
          startDate: "2024-10-09T00:00:00.000Z",
          endDate: "2024-10-11T00:00:00.000Z",
        },
      });
      const searchResult: DressSearchResult =
        await dressRepository.search(searchParams);

      const containsDressItem1 = searchResult.items.some((dress) =>
        dress.equals(dresses[0]),
      );
      const containsDressItem2 = searchResult.items.some((dress) =>
        dress.equals(dresses[1]),
      );
      expect(containsDressItem1).toBe(true);
      expect(containsDressItem2).toBe(true);
      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.total).toBe(2);
    });

    // **Casos de Borda**
    it("should return no dresses available when all have overlapping reservations", async () => {
      const dresses = Dress.fake().theDresses(2).build();
      await dressRepository.saveMany(dresses);

      const booking1 = Booking.fake()
        .aBooking()
        .withExpectedBookingPeriod(
          new BookingPeriod({
            pickUpDate: DateVo.create("2024-10-07T00:00:00.000Z"),
            returnDate: DateVo.create("2024-10-08T00:00:00.000Z"),
          }),
        )
        .build();

      const booking2 = Booking.fake()
        .aBooking()
        .withExpectedBookingPeriod(
          new BookingPeriod({
            pickUpDate: DateVo.create("2024-10-09T00:00:00.000Z"),
            returnDate: DateVo.create("2024-10-11T00:00:00.000Z"),
          }),
        )
        .build();

      const dressBookingItem1 = BookingDressItem.fake()
        .aDressItem()
        .withProductId(dresses[0].getId().getValue())
        .build();
      const dressBookingItem2 = BookingDressItem.fake()
        .aDressItem()
        .withProductId(dresses[1].getId().getValue())
        .build();

      booking1.addItem(dressBookingItem1);
      booking2.addItem(dressBookingItem2);
      await bookingRepository.saveMany([booking1, booking2]);

      const searchParams = DressSearchParams.create({
        filter: {
          available: false,
          startDate: "2024-10-07T00:00:00.000Z",
          endDate: "2024-10-12T00:00:00.000Z",
        },
      });
      const searchResult: DressSearchResult =
        await dressRepository.search(searchParams);

      const containsDressItem1 = searchResult.items.some((dress) =>
        dress.equals(dresses[0]),
      );
      const containsDressItem2 = searchResult.items.some((dress) =>
        dress.equals(dresses[1]),
      );
      expect(containsDressItem1).toBe(true);
      expect(containsDressItem2).toBe(true);
      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.total).toBe(2);
    });

    // **Testes de Paginação e Ordenação**

    it("should return dresses with pagination and sorting", async () => {
      const dresses = Dress.fake()
        .theDresses(3)
        .withModel((index) => (index === 0 ? "Evening Dress" : "Day Dress"))
        .withColor((index) => (index === 0 ? "Red" : "Blue"))
        .build();
      await dressRepository.saveMany(dresses);
      const searchParams = DressSearchParams.create({
        page: 1,
        perPage: 2,
        sort: "model",
        sortDir: "asc",
        filter: {
          color: "Red",
        },
      });
      const searchResult: DressSearchResult =
        await dressRepository.search(searchParams);
      expect(searchResult.items).toHaveLength(1);
      expect(searchResult.items[0].getModel()).toBe("Evening Dress");
      expect(searchResult.items[0].getColor()).toBe("Red");
      expect(searchResult.total).toBe(1);
      expect(searchResult.currentPage).toBe(1);
      expect(searchResult.perPage).toBe(2);
    });

    it("should return dresses sorted by rentPrice in descending order", async () => {
      const dresses = Dress.fake()
        .theDresses(3)
        .withRentPrice((index) => 150 + index * 30)
        .build();
      await dressRepository.saveMany(dresses);

      // Criando os parâmetros de busca com ordenação por preço
      const searchParams = DressSearchParams.create({
        page: 1,
        perPage: 3,
        sort: "rentPrice",
        sortDir: "desc",
      });

      // Realizando a busca
      const searchResult: DressSearchResult =
        await dressRepository.search(searchParams);

      // Verificando a ordenação dos itens
      expect(searchResult.items).toHaveLength(3);
      expect(searchResult.items[0].getRentPrice()).toBe(210.0); // Maior preço
      expect(searchResult.items[1].getRentPrice()).toBe(180.0);
      expect(searchResult.items[2].getRentPrice()).toBe(150.0); // Menor preço
    });

    it("should return no dresses if filter does not match", async () => {
      const dress = Dress.fake().aDress().withColor("Red").build();
      await dressRepository.save(dress);
      const searchParams = DressSearchParams.create({
        page: 1,
        perPage: 10,
        filter: {
          color: "Green", // Nenhum vestido tem a cor "Green"
        },
      });
      const searchResult: DressSearchResult =
        await dressRepository.search(searchParams);
      expect(searchResult.items).toHaveLength(0);
      expect(searchResult.total).toBe(0);
    });
  });

  // **Testes de Salvar, Deletar, e Existência**

  describe("save", () => {
    it("should save a dress entity successfully", async () => {
      const dress = Dress.fake().aDress().build();
      await dressRepository.save(dress);
      const savedDress = await dressRepository.findById(dress.getId());
      expect(savedDress?.equals(dress)).toBe(true);
    });
  });

  describe("delete", () => {
    it("should delete a dress entity successfully", async () => {
      const dress = Dress.fake().aDress().build();
      await dressRepository.save(dress);
      await dressRepository.delete(dress.getId());
      const deletedDress = await dressRepository.findById(dress.getId());
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
      });

      await dressRepository.save(dress);

      const result = await dressRepository.existsById([
        dress.getId(),
        DressId.create(uuidv4()), // ‘ID’ aleatório não existente
      ]);
      expect(result.exists).toContainEqual(dress.getId());
      expect(result.notExists).toHaveLength(1);
    });
  });
});
