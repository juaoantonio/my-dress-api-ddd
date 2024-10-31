import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";

import {
  Booking,
  BookingId,
  BookingStatus,
} from "@core/booking/domain/booking.aggregate-root";
import { BookingDressItem } from "@core/booking/domain/entities/booking-dress-item.entity";
import { Adjustment } from "@core/booking/domain/entities/vo/adjustment.vo";
import { v4 as uuidv4 } from "uuid";
import { BookingItemDressModel } from "@core/booking/infra/db/typeorm/booking-item-dress.model";
import { BookingTypeormRepository } from "@core/booking/infra/db/typeorm/booking.typeorm-repository";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BookingItemClutchModel } from "@core/booking/infra/db/typeorm/booking-item-clutch.model";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { ClutchTypeormRepository } from "@core/products/infra/db/typeorm/clutch/clutch.typeorm-repository";
import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { BookingClutchItem } from "@core/booking/domain/entities/booking-clutch-item.entity";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";

describe("BookingTypeormRepository Integration Test", () => {
  let bookingRepository: BookingTypeormRepository;
  let dressRepository: DressTypeormRepository;
  let clutchRepository: ClutchTypeormRepository;
  const setup = setupTypeOrmForIntegrationTests({
    entities: [
      BookingModel,
      BookingItemDressModel,
      BookingItemClutchModel,
      DressModel,
      ClutchModel,
    ],
  });

  beforeEach(() => {
    const modelRepository = setup.dataSource.getRepository(BookingModel);
    bookingRepository = new BookingTypeormRepository(modelRepository);
    const dressModelRepository = setup.dataSource.getRepository(DressModel);
    dressRepository = new DressTypeormRepository(dressModelRepository);
    const clutchModelRepository = setup.dataSource.getRepository(ClutchModel);
    clutchRepository = new ClutchTypeormRepository(clutchModelRepository);

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01"));
  });

  describe("save", () => {
    it("should save a single booking successfully", async () => {
      const booking = Booking.create({
        customerName: "John Doe",
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });
      await bookingRepository.save(booking);
      const savedBooking = await bookingRepository.findById(booking.getId());
      expect(savedBooking.equals(booking)).toBe(true);
    });

    it("should save a single booking with dresses successfully", async () => {
      const dressId = DressId.create(uuidv4());
      const dress = Dress.fake().aDress().withId(dressId).build();
      await dressRepository.save(dress);
      const bookingItem = BookingDressItem.create({
        productId: dressId.value,
        rentPrice: 150.0,
        isCourtesy: false,
        adjustments: [new Adjustment("Size Adjustment", "Adjusted to size M")],
      });

      const booking = Booking.create({
        customerName: "Jane Doe",
        amountPaid: 150,
        status: BookingStatus.READY,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [bookingItem],
      });
      await bookingRepository.save(booking);
      const savedBooking = await bookingRepository.findById(booking.getId());
      expect(savedBooking.equals(booking)).toBe(true);
    });

    it("should save multiple bookings successfully", async () => {
      const dressId = DressId.create(uuidv4());
      const clutchId = ClutchId.create(uuidv4());
      const dress = Dress.fake().aDress().withId(dressId).build();
      const clutch = Dress.fake().aDress().withId(clutchId).build();
      await dressRepository.save(dress);
      await clutchRepository.save(clutch);
      const dressItem = BookingDressItem.create({
        productId: dressId.value,
        rentPrice: 150.0,
        isCourtesy: false,
        adjustments: [new Adjustment("Size Adjustment", "Adjusted to size M")],
      });
      const clutchItem = BookingClutchItem.create({
        productId: clutchId.value,
        rentPrice: 200.0,
        isCourtesy: false,
      });

      const booking1 = Booking.create({
        customerName: "Customer One",
        amountPaid: 100.0,
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [dressItem],
      });

      const booking2 = Booking.create({
        customerName: "Customer Two",
        amountPaid: 150.0,
        status: BookingStatus.READY,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
        clutches: [clutchItem],
      });
      await bookingRepository.saveMany([booking1, booking2]);
      const foundBooking1 = await bookingRepository.findById(booking1.getId());
      const foundBooking2 = await bookingRepository.findById(booking2.getId());
      expect(foundBooking1.equals(booking1)).toBe(true);
      expect(foundBooking2.equals(booking2)).toBe(true);
    });
  });

  describe("update", () => {
    it("should update an existing booking successfully", async () => {
      const booking = Booking.create({
        customerName: "Jane Doe",
        amountPaid: 100.0,
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });

      await bookingRepository.save(booking);

      booking.changeCustomerName("Jane Smith");
      booking.start();

      await bookingRepository.update(booking);

      const updatedBooking = await bookingRepository.findById(booking.getId());
      expect(updatedBooking?.getCustomerName()).toBe("Jane Smith");
      expect(updatedBooking?.getStatus()).toBe(BookingStatus.PAYMENT_PENDING);
    });

    it("should throw EntityNotFoundError when trying to update a non-existent booking", async () => {
      const nonExistentId = BookingId.random();

      const booking = Booking.create({
        id: nonExistentId.value,
        customerName: "Non-existent Customer",
        amountPaid: 50.0,
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });

      await expect(bookingRepository.update(booking)).rejects.toThrow(
        `Booking with id(s) ${nonExistentId} not found`,
      );
    });
  });

  describe("findById", () => {
    it("should find a booking by id successfully", async () => {
      const booking = Booking.create({
        customerName: "Alice Johnson",
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });
      await bookingRepository.save(booking);
      const foundBooking = await bookingRepository.findById(booking.getId());
      expect(foundBooking.equals(booking)).toBe(true);
    });

    it("should return null when booking is not found by id", async () => {
      const nonExistentId = BookingId.random();
      const foundBooking = await bookingRepository.findById(nonExistentId);
      expect(foundBooking).toBeNull();
    });
  });

  describe("findMany", () => {
    it("should retrieve all bookings successfully", async () => {
      const booking1 = Booking.create({
        customerName: "Customer One",
        amountPaid: 100.0,
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });

      const booking2 = Booking.create({
        customerName: "Customer Two",
        amountPaid: 150.0,
        status: BookingStatus.READY,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });
      await bookingRepository.saveMany([booking1, booking2]);
      const bookings = await bookingRepository.findMany();
      expect(bookings).toHaveLength(2);
      const [foundBooking1, foundBooking2] = bookings;
      expect(foundBooking1.equals(booking1)).toBe(true);
      expect(foundBooking2.equals(booking2)).toBe(true);
    });

    it("should return an empty array when there are no bookings", async () => {
      const bookings = await bookingRepository.findMany();
      expect(bookings).toHaveLength(0);
    });
  });

  describe("findManyByIds", () => {
    it("should find multiple bookings by their ids successfully", async () => {
      const booking1 = Booking.create({
        customerName: "Customer A",
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });

      const booking2 = Booking.create({
        customerName: "Customer B",
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });
      await bookingRepository.saveMany([booking1, booking2]);
      const foundBookings = await bookingRepository.findManyByIds([
        booking1.getId(),
        booking2.getId(),
      ]);
      expect(foundBookings).toHaveLength(2);
      const foundBooking1 = foundBookings.find((b) =>
        b.getId().equals(booking1.getId()),
      );
      const foundBooking2 = foundBookings.find((b) =>
        b.getId().equals(booking2.getId()),
      );
      expect(foundBooking1.equals(booking1)).toBe(true);
      expect(foundBooking2.equals(booking2)).toBe(true);
    });

    it("should return only existing bookings when some ids do not exist", async () => {
      const booking = Booking.create({
        customerName: "Customer X",
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });
      await bookingRepository.save(booking);
      const nonExistentId = BookingId.random();
      const foundBookings = await bookingRepository.findManyByIds([
        booking.getId(),
        nonExistentId,
      ]);
      expect(foundBookings).toHaveLength(1);
      const [foundBooking] = foundBookings;
      expect(foundBooking.getId()).toEqual(booking.getId());
    });

    it("should return an empty array when none of the ids exist", async () => {
      const nonExistentIds = [BookingId.random(), BookingId.random()];

      const foundBookings =
        await bookingRepository.findManyByIds(nonExistentIds);
      expect(foundBookings).toHaveLength(0);
    });
  });

  describe("delete", () => {
    it("should delete an existing booking successfully", async () => {
      const booking = Booking.create({
        customerName: "To Be Deleted",
        amountPaid: 50.0,
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });
      await bookingRepository.save(booking);
      await bookingRepository.delete(booking.getId());
      const deletedBooking = await bookingRepository.findById(booking.getId());
      expect(deletedBooking).toBeNull();
    });

    it("should throw EntityNotFoundError when trying to delete a non-existent booking", async () => {
      const nonExistentId = BookingId.create(
        "830e6080-95a3-40e3-9012-88036866dcd7",
      );

      await expect(bookingRepository.delete(nonExistentId)).rejects.toThrow(
        "Booking with id(s) 830e6080-95a3-40e3-9012-88036866dcd7 not found",
      );
    });
  });

  describe("deleteManyByIds", () => {
    it("should delete multiple existing bookings successfully", async () => {
      const booking1 = Booking.create({
        customerName: "Customer 1",
        amountPaid: 60.0,
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });

      const booking2 = Booking.create({
        customerName: "Customer 2",
        amountPaid: 70.0,
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });

      await bookingRepository.saveMany([booking1, booking2]);

      await bookingRepository.deleteManyByIds([
        booking1.getId(),
        booking2.getId(),
      ]);

      const deletedBooking1 = await bookingRepository.findById(
        booking1.getId(),
      );
      const deletedBooking2 = await bookingRepository.findById(
        booking2.getId(),
      );

      expect(deletedBooking1).toBeNull();
      expect(deletedBooking2).toBeNull();
    });

    it("should throw EntityNotFoundError when trying to delete some non-existent bookings", async () => {
      const booking = Booking.create({
        customerName: "Existing Customer",
        amountPaid: 85.0,
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });

      await bookingRepository.save(booking);

      const nonExistentId = BookingId.create(
        "830e6080-95a3-40e3-9012-88036866dcd7",
      );

      await expect(
        bookingRepository.deleteManyByIds([booking.getId(), nonExistentId]),
      ).rejects.toThrow(
        "Booking with id(s) 830e6080-95a3-40e3-9012-88036866dcd7 not found",
      );
    });
  });

  describe("existsById", () => {
    it("should correctly identify existing and non-existing booking ids", async () => {
      const booking1 = Booking.create({
        customerName: "Customer A",
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });

      const booking2 = Booking.create({
        customerName: "Customer B",
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        dresses: [],
      });
      await bookingRepository.saveMany([booking1, booking2]);
      const nonExistentId = BookingId.random();
      const result = await bookingRepository.existsById([
        booking1.getId(),
        nonExistentId,
      ]);
      expect(result.exists).toContainEqual(booking1.getId());
      expect(result.notExists).toContainEqual(nonExistentId);
    });
  });
});
