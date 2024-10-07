import { BookingTypeormRepository } from "@core/booking/infra/typeorm/booking.typeorm-repository";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { BookingModel } from "@core/booking/infra/typeorm/booking.model";
import { BookingItemModel } from "@core/booking/infra/typeorm/booking-item.model";
import {
  Booking,
  BookingId,
  BookingStatus,
} from "@core/booking/domain/booking.aggregate-root";
import { BookingItem } from "@core/booking/domain/entities/booking-item.entity";
import { Adjustment } from "@core/booking/domain/entities/vo/adjustment.vo";
import { v4 as uuidv4 } from "uuid";

describe("BookingTypeormRepository Integration Test", () => {
  let repository: BookingTypeormRepository;
  const setup = setupTypeOrmForIntegrationTests({
    entities: [BookingModel, BookingItemModel],
  });

  beforeEach(() => {
    const modelRepository = setup.dataSource.getRepository(BookingModel);
    repository = new BookingTypeormRepository(modelRepository);

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
        items: [],
      });
      await repository.save(booking);
      const savedBooking = await repository.findById(booking.getId());
      expect(savedBooking.equals(booking)).toBe(true);
    });

    it("should save a single booking with items successfully", async () => {
      const bookingItem = BookingItem.create({
        productId: uuidv4(),
        type: "dress",
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
        items: [bookingItem],
      });
      await repository.save(booking);
      const savedBooking = await repository.findById(booking.getId());
      expect(savedBooking.equals(booking)).toBe(true);
    });

    it("should save multiple bookings successfully", async () => {
      const bookingItem1 = BookingItem.create({
        productId: uuidv4(),
        type: "dress",
        rentPrice: 150.0,
        isCourtesy: false,
        adjustments: [new Adjustment("Size Adjustment", "Adjusted to size M")],
      });

      const bookingItem2 = BookingItem.create({
        productId: uuidv4(),
        type: "clutch",
        rentPrice: 200.0,
        isCourtesy: false,
        adjustments: [new Adjustment("Size Adjustment", "Adjusted to size L")],
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
        items: [bookingItem1],
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
        items: [bookingItem2],
      });
      await repository.saveMany([booking1, booking2]);
      const foundBooking1 = await repository.findById(booking1.getId());
      const foundBooking2 = await repository.findById(booking2.getId());
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
        items: [],
      });

      await repository.save(booking);

      booking.changeCustomerName("Jane Smith");
      booking.start();

      await repository.update(booking);

      const updatedBooking = await repository.findById(booking.getId());
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
        items: [],
      });

      await expect(repository.update(booking)).rejects.toThrow(
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
        items: [],
      });
      await repository.save(booking);
      const foundBooking = await repository.findById(booking.getId());
      expect(foundBooking.equals(booking)).toBe(true);
    });

    it("should return null when booking is not found by id", async () => {
      const nonExistentId = BookingId.random();
      const foundBooking = await repository.findById(nonExistentId);
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
        items: [],
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
        items: [],
      });
      await repository.saveMany([booking1, booking2]);
      const bookings = await repository.findMany();
      expect(bookings).toHaveLength(2);
      const [foundBooking1, foundBooking2] = bookings;
      expect(foundBooking1.equals(booking1)).toBe(true);
      expect(foundBooking2.equals(booking2)).toBe(true);
    });

    it("should return an empty array when there are no bookings", async () => {
      const bookings = await repository.findMany();
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
        items: [],
      });

      const booking2 = Booking.create({
        customerName: "Customer B",
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        items: [],
      });
      await repository.saveMany([booking1, booking2]);
      const foundBookings = await repository.findManyByIds([
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
        items: [],
      });
      await repository.save(booking);
      const nonExistentId = BookingId.random();
      const foundBookings = await repository.findManyByIds([
        booking.getId(),
        nonExistentId,
      ]);
      expect(foundBookings).toHaveLength(1);
      const [foundBooking] = foundBookings;
      expect(foundBooking.getId()).toEqual(booking.getId());
    });

    it("should return an empty array when none of the ids exist", async () => {
      const nonExistentIds = [BookingId.random(), BookingId.random()];

      const foundBookings = await repository.findManyByIds(nonExistentIds);
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
        items: [],
      });
      await repository.save(booking);
      await repository.delete(booking.getId());
      const deletedBooking = await repository.findById(booking.getId());
      expect(deletedBooking).toBeNull();
    });

    it("should throw EntityNotFoundError when trying to delete a non-existent booking", async () => {
      const nonExistentId = BookingId.create(
        "830e6080-95a3-40e3-9012-88036866dcd7",
      );

      await expect(repository.delete(nonExistentId)).rejects.toThrow(
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
        items: [],
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
        items: [],
      });

      await repository.saveMany([booking1, booking2]);

      await repository.deleteManyByIds([booking1.getId(), booking2.getId()]);

      const deletedBooking1 = await repository.findById(booking1.getId());
      const deletedBooking2 = await repository.findById(booking2.getId());

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
        items: [],
      });

      await repository.save(booking);

      const nonExistentId = BookingId.create(
        "830e6080-95a3-40e3-9012-88036866dcd7",
      );

      await expect(
        repository.deleteManyByIds([booking.getId(), nonExistentId]),
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
        items: [],
      });

      const booking2 = Booking.create({
        customerName: "Customer B",
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: new Date().toISOString(),
        expectedPickUpDate: new Date().toISOString(),
        expectedReturnDate: new Date().toISOString(),
        pickUpDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
        items: [],
      });
      await repository.saveMany([booking1, booking2]);
      const nonExistentId = BookingId.random();
      const result = await repository.existsById([
        booking1.getId(),
        nonExistentId,
      ]);
      expect(result.exists).toContainEqual(booking1.getId());
      expect(result.notExists).toContainEqual(nonExistentId);
    });
  });
});
