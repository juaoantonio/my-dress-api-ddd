import { BookingPeriod } from "./booking-period.vo";
import { Booking, BookingId, BookingStatus } from "./booking.aggregate-root";
import { DateVo } from "../../@shared/domain/value-objects/date.vo";
import {
  BookingDressItem,
  BookingDressItemId,
} from "./entities/booking-dress-item.entity";
import { BookingClutchItem } from "@core/booking/domain/entities/booking-clutch-item.entity";

describe("Booking Aggregate Unit Tests", function () {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-08-30"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Booking Create Constructor", function () {
    it("should create a valid booking with actual booking period", () => {
      const booking = new Booking({
        id: BookingId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: DateVo.create("2024-09-01"),
        expectedBookingPeriod: new BookingPeriod({
          pickUpDate: DateVo.create("2024-08-31"),
          returnDate: DateVo.create("2024-09-02"),
        }),
        bookingPeriod: new BookingPeriod({
          pickUpDate: DateVo.create("2024-08-31"),
          returnDate: DateVo.create("2024-09-02"),
        }),
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-8644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        status: BookingStatus.PAYMENT_PENDING,
      });
      expect(booking.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(booking.getCustomerName()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(booking.getEventDate().getDateFormatted()).toBe("2024-09-01");
      expect(
        booking.getBookingPeriod().getPickUpDate().getDateFormatted(),
      ).toBe("2024-08-31");
      expect(
        booking.getBookingPeriod().getReturnDate().getDateFormatted(),
      ).toBe("2024-09-02");
      expect(booking.getBookingPeriod().getTotalDays()).toBe(2);
      expect(
        booking.getExpectedBookingPeriod().getPickUpDate().getDateFormatted(),
      ).toBe("2024-08-31");
      expect(
        booking.getExpectedBookingPeriod().getReturnDate().getDateFormatted(),
      ).toBe("2024-09-02");
      expect(booking.getExpectedBookingPeriod().getTotalDays()).toBe(2);
      expect(booking.getBookingPeriod()).toStrictEqual(
        booking.getExpectedBookingPeriod(),
      );
      expect(booking.getDresses().length).toBe(1);
      expect(booking.getClutches().length).toBe(1);
      expect(booking.getItems().length).toBe(2);
      expect(booking.getStatus()).toBe(BookingStatus.PAYMENT_PENDING);
      expect(booking.calculateTotalPrice()).toBe(200);
      expect(booking.getAmountPaid()).toBe(0);
    });

    it("should create a valid booking without actual booking period", () => {
      const booking = new Booking({
        id: BookingId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: DateVo.create("2024-09-01"),
        expectedBookingPeriod: new BookingPeriod({
          pickUpDate: DateVo.create("2024-08-31"),
          returnDate: DateVo.create("2024-09-02"),
        }),
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-8644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        status: BookingStatus.PAYMENT_PENDING,
      });
      expect(booking.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(booking.getCustomerName()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(booking.getEventDate().getDateFormatted()).toBe("2024-09-01");
      expect(booking.getBookingPeriod()).toBe(undefined);
      expect(
        booking.getExpectedBookingPeriod().getPickUpDate().getDateFormatted(),
      ).toBe("2024-08-31");
      expect(
        booking.getExpectedBookingPeriod().getReturnDate().getDateFormatted(),
      ).toBe("2024-09-02");
      expect(booking.getExpectedBookingPeriod().getTotalDays()).toBe(2);
      expect(booking.getDresses().length).toBe(1);
      expect(booking.getClutches().length).toBe(1);
      expect(booking.getItems().length).toBe(2);
      expect(booking.getStatus()).toBe(BookingStatus.PAYMENT_PENDING);
      expect(booking.calculateTotalPrice()).toBe(200);
      expect(booking.getAmountPaid()).toBe(0);
    });
  });

  describe("Booking Create Factory Method", function () {
    it("should create a valid booking with just required fields", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-8644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
      });
      booking.initBookingProcess();
      expect(booking.getId().getValue()).toBeDefined();
      expect(booking.getCustomerName()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(booking.getEventDate().getDateFormatted()).toBe("2024-09-01");
      expect(booking.getBookingPeriod()).toBe(undefined);
      expect(
        booking.getExpectedBookingPeriod().getPickUpDate().getDateFormatted(),
      ).toBe("2024-08-31");
      expect(
        booking.getExpectedBookingPeriod().getReturnDate().getDateFormatted(),
      ).toBe("2024-09-02");
      expect(booking.getExpectedBookingPeriod().getTotalDays()).toBe(2);
      expect(booking.getItems().length).toBe(2);
      expect(booking.getStatus()).toBe(BookingStatus.PAYMENT_PENDING);
      expect(booking.calculateTotalPrice()).toBe(200);
      expect(booking.getAmountPaid()).toBe(0);
    });

    it("should create a valid booking with all fields", () => {
      const booking = Booking.create({
        id: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        pickUpDate: "2024-08-31",
        returnDate: "2024-09-02",
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 50,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
      });
      booking.initBookingProcess();
      expect(booking.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(booking.getCustomerName()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(booking.getEventDate().getDateFormatted()).toBe("2024-09-01");
      expect(
        booking.getBookingPeriod().getPickUpDate().getDateFormatted(),
      ).toBe("2024-08-31");
      expect(
        booking.getBookingPeriod().getReturnDate().getDateFormatted(),
      ).toBe("2024-09-02");
      expect(booking.getBookingPeriod().getTotalDays()).toBe(2);
      expect(
        booking.getExpectedBookingPeriod().getPickUpDate().getDateFormatted(),
      ).toBe("2024-08-31");
      expect(
        booking.getExpectedBookingPeriod().getReturnDate().getDateFormatted(),
      ).toBe("2024-09-02");
      expect(booking.getExpectedBookingPeriod().getTotalDays()).toBe(2);
      expect(booking.getBookingPeriod()).toStrictEqual(
        booking.getExpectedBookingPeriod(),
      );
      expect(booking.getItems().length).toBe(2);
      expect(booking.getStatus()).toBe(BookingStatus.PAYMENT_PENDING);
      expect(booking.calculateTotalPrice()).toBe(150);
      expect(booking.getAmountPaid()).toBe(0);
    });
  });

  describe("Booking Behavior Methods", function () {
    it("should add an item to the booking", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 50,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
      });
      booking.addItem(
        new BookingDressItem({
          id: BookingDressItemId.random(),
          productId: "81d4babd-9644-4b6a-afaf-930f6608f6d6",
          rentPrice: 50,
          fabric: "Seda",
          color: "Azul",
          model: "Vestido de Festa",
          imagePath: "http://image.com",
        }),
      );
      expect(booking.getItems().length).toBe(3);
      expect(booking.calculateTotalPrice()).toBe(200);
    });

    it("should remove an item from booking", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.create(
              "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            ),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4aabd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 50,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
      });
      booking.removeItem("81d4babd-9644-4b6a-afaf-930f6608f6d5");
      expect(booking.getItems().length).toBe(1);
      expect(booking.calculateTotalPrice()).toBe(50);
    });

    it("should update amount paid", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 50,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
      });
      booking.initBookingProcess();
      booking.addPayment(50);
      expect(booking.getAmountPaid()).toBe(50);
      expect(booking.getStatus()).toBe(BookingStatus.PAYMENT_PENDING);
    });

    it("should ignore item's price if is courtesy when calculate total price", () => {
      const booking = Booking.fake().aBooking().build();
      const dressItem1 = BookingDressItem.fake()
        .aDressItem()
        .withIsCourtesy(false)
        .withRentPrice(200)
        .build();
      const dressItem2 = BookingDressItem.fake()
        .aDressItem()
        .withIsCourtesy(true)
        .withRentPrice(200)
        .build();
      const clutchItem = BookingClutchItem.fake()
        .aClutchItem()
        .withIsCourtesy(true)
        .withRentPrice(100)
        .build();
      booking.addManyItems([dressItem1, dressItem2, clutchItem]);
      expect(booking.calculateTotalPrice()).toBe(200);
    });

    it("should mark booking as confirmed if amountPaid is equal to 50% of booking price", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 50,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
      });
      booking.initBookingProcess();
      booking.addPayment(75);
      expect(booking.getStatus()).toBe(BookingStatus.CONFIRMED);
    });

    it("should update total price when a item is added", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
      });
      booking.addItem(
        new BookingDressItem({
          id: BookingDressItemId.random(),
          productId: "81d4babd-9644-4b6a-afaf-930f6608f6d6",
          rentPrice: 50,
          fabric: "Seda",
          color: "Azul",
          model: "Vestido de Festa",
          imagePath: "http://image.com",
        }),
      );
      expect(booking.calculateTotalPrice()).toBe(150);
      booking.addItem(
        new BookingClutchItem({
          id: BookingDressItemId.random(),
          productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
          rentPrice: 50,
          color: "Azul",
          model: "Vestido de Festa",
          imagePath: "http://image.com",
        }),
      );
      expect(booking.calculateTotalPrice()).toBe(200);
    });

    it("should update total price when a item is removed", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.create(
              "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            ),
            productId: "81d4bbbd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 50,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
      });
      booking.removeItem("81d4babd-9644-4b6a-afaf-930f6608f6d5");
      expect(booking.calculateTotalPrice()).toBe(100);
    });

    it("should initialize a booking", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 50,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
      });
      booking.initBookingProcess();
      booking.addPayment(75);
      expect(booking.getStatus()).toBe(BookingStatus.CONFIRMED);
      booking.addPayment(75);
      expect(booking.getStatus()).toBe(BookingStatus.READY);
      booking.informItemsDelivery();
      expect(booking.getStatus()).toBe(BookingStatus.IN_PROGRESS);
    });

    it("should cancel booking", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 50,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
      });
      booking.cancel();
      expect(booking.getStatus()).toBe(BookingStatus.CANCELED);
    });

    it("should complete a booking", () => {
      vi.setSystemTime(new Date("2024-09-02"));
      const booking = new Booking({
        id: BookingId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: DateVo.create("2024-09-01"),
        expectedBookingPeriod: new BookingPeriod({
          pickUpDate: DateVo.create("2024-08-31"),
          returnDate: DateVo.create("2024-09-02"),
        }),
        bookingPeriod: new BookingPeriod({
          pickUpDate: DateVo.create("2024-08-31"),
        }),
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 50,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        status: BookingStatus.IN_PROGRESS,
        amountPaid: 100,
      });
      booking.complete();
      expect(booking.getStatus()).toBe(BookingStatus.COMPLETED);
      expect(
        booking.getBookingPeriod()?.getReturnDate()?.getDateFormatted(),
      ).toBe("2024-09-02");
    });

    it("should not initialize a booking if it has no dresses and clutches assigned", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [],
        clutches: [],
      });
      booking.initBookingProcess();
      expect(booking.notification).notificationContainsErrorMessages([
        "Não é possível iniciar uma reserva sem itens",
      ]);
    });

    it("should initialize a booking if it has no dresses assigned", () => {
      const booking = Booking.create({
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: "2024-09-01",
        expectedPickUpDate: "2024-08-31",
        expectedReturnDate: "2024-09-02",
        dresses: [],
        clutches: [BookingClutchItem.fake().aClutchItem().build()],
      });
      booking.initBookingProcess();
      expect(booking.getStatus()).toBe(BookingStatus.PAYMENT_PENDING);
    });

    it("should override items if passed items dont have same product id", () => {
      const dressItem = BookingDressItem.fake()
        .aDressItem()
        .withProductId("123")
        .build();
      const clutchItems = BookingClutchItem.fake()
        .aClutchItem()
        .withProductId("321")
        .build();
      const booking = Booking.fake()
        .aBooking()
        .withDresses([dressItem])
        .withClutches([clutchItems])
        .build();
      const newDressItem = BookingDressItem.fake()
        .aDressItem()
        .withProductId("456")
        .build();
      const newClutchItem = BookingClutchItem.fake()
        .aClutchItem()
        .withProductId("654")
        .build();
      booking.addManyItems([newDressItem, newClutchItem]);
      expect(booking.getItems().length).toBe(2);
      expect(booking.getDresses()).toContain(newDressItem);
      expect(booking.getClutches()).toContain(newClutchItem);
    });

    it("should not override items if items with same productId are passed", () => {
      const dressItem = BookingDressItem.fake()
        .aDressItem()
        .withProductId("123")
        .build();
      const clutchItem = BookingClutchItem.fake()
        .aClutchItem()
        .withProductId("321")
        .build();
      const booking = Booking.fake()
        .aBooking()
        .withDresses([dressItem])
        .withClutches([clutchItem])
        .build();
      const newDressItem = BookingDressItem.fake()
        .aDressItem()
        .withProductId("456")
        .build();
      const newClutchItem = BookingClutchItem.fake()
        .aClutchItem()
        .withProductId("654")
        .build();
      booking.addManyItems([
        newDressItem,
        newClutchItem,
        dressItem,
        clutchItem,
      ]);
      expect(booking.getItems().length).toBe(4);
      expect(booking.getDresses()).toContain(dressItem);
      expect(booking.getClutches()).toContain(clutchItem);
      expect(booking.getDresses()).toContain(newDressItem);
      expect(booking.getClutches()).toContain(newClutchItem);
    });
  });

  describe("Booking Validation", function () {
    describe("Validate Booking Behavior Methods", function () {
      it("should validate amountPaid if not positive", () => {
        const booking = Booking.create({
          customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
          eventDate: "2024-09-01",
          expectedPickUpDate: "2024-08-31",
          expectedReturnDate: "2024-09-02",
          dresses: [
            new BookingDressItem({
              id: BookingDressItemId.random(),
              productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
              rentPrice: 100,
              fabric: "Seda",
              color: "Azul",
              model: "Vestido de Festa",
              imagePath: "http://image.com",
            }),
          ],
          clutches: [
            new BookingClutchItem({
              id: BookingDressItemId.random(),
              productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
              rentPrice: 50,
              color: "Azul",
              model: "Vestido de Festa",
              imagePath: "http://image.com",
            }),
          ],
        });
        booking.initBookingProcess();
        booking.addPayment(-50);
        expect(booking.notification).notificationContainsErrorMessages([
          {
            amountPaid: ["Valor pago deve ser maior ou igual a 0"],
          },
        ]);
        expect(booking.notification.hasErrors()).toBe(true);
      });

      it("should validate amountPaid if is greater than total price", () => {
        const booking = Booking.create({
          customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
          eventDate: "2024-09-01",
          expectedPickUpDate: "2024-08-31",
          expectedReturnDate: "2024-09-02",
          dresses: [
            new BookingDressItem({
              id: BookingDressItemId.random(),
              productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
              rentPrice: 100,
              fabric: "Seda",
              color: "Azul",
              model: "Vestido de Festa",
              imagePath: "http://image.com",
            }),
          ],
          clutches: [
            new BookingClutchItem({
              id: BookingDressItemId.random(),
              productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
              rentPrice: 50,
              color: "Azul",
              model: "Vestido de Festa",
              imagePath: "http://image.com",
            }),
          ],
        });
        booking.initBookingProcess();
        booking.addPayment(300);
        expect(booking.notification).notificationContainsErrorMessages([
          {
            amountPaid: [
              "Valor pago não pode ser maior que o valor total da reserva",
            ],
          },
        ]);
      });

      it("should validate invalid booking items", () => {
        const booking = Booking.create({
          customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
          eventDate: "2024-09-01",
          expectedPickUpDate: "2024-08-31",
          expectedReturnDate: "2024-09-02",
          dresses: [
            BookingDressItem.create({
              id: BookingDressItemId.create(
                "81d4babd-9644-4b6a-afaf-930f6608f6d5",
              ),
              productId: "",
              rentPrice: 100,
              fabric: "Seda",
              color: "Azul",
              model: "Vestido de Festa",
              imagePath: "http://image.com",
            }),
          ],
          clutches: [
            BookingClutchItem.create({
              id: BookingDressItemId.create(
                "81d4babd-9644-4b6a-afaf-930f6608f6c5",
              ),
              productId: "",
              rentPrice: 50,
              color: "Azul",
              model: "Vestido de Festa",
              imagePath: "http://image.com",
            }),
          ],
        });
        expect(booking.notification).notificationContainsErrorMessages([
          {
            items: [
              "Item de reserva (81d4babd-9644-4b6a-afaf-930f6608f6d5) inválido",
              "Item de reserva (81d4babd-9644-4b6a-afaf-930f6608f6c5) inválido",
            ],
          },
        ]);
      });

      it("should validate when adding a invalid booking item", () => {
        const booking = Booking.create({
          customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
          eventDate: "2024-09-01",
          expectedPickUpDate: "2024-08-31",
          expectedReturnDate: "2024-09-02",
          dresses: [
            new BookingDressItem({
              id: BookingDressItemId.random(),
              productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
              rentPrice: 100,
              fabric: "Seda",
              color: "Azul",
              model: "Vestido de Festa",
              imagePath: "http://image.com",
            }),
          ],
          clutches: [
            new BookingClutchItem({
              id: BookingDressItemId.random(),
              productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
              rentPrice: 50,
              color: "Azul",
              model: "Vestido de Festa",
              imagePath: "http://image.com",
            }),
          ],
        });
        booking.addItem(
          BookingDressItem.create({
            id: BookingDressItemId.create(
              "91d4babd-9644-4b6a-afaf-930f6608f6d5",
            ),
            productId: "",
            rentPrice: 50,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        );
        expect(booking.notification).notificationContainsErrorMessages([
          {
            items: [
              "Item de reserva (vestido) (91d4babd-9644-4b6a-afaf-930f6608f6d5) inválido",
            ],
          },
        ]);
      });

      it("should validate when starting a booking with invalid status", () => {
        const booking = Booking.create({
          customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
          eventDate: "2024-09-01",
          expectedPickUpDate: "2024-08-31",
          expectedReturnDate: "2024-09-02",
          dresses: [
            new BookingDressItem({
              id: BookingDressItemId.random(),
              productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
              rentPrice: 100,
              fabric: "Seda",
              color: "Azul",
              model: "Vestido de Festa",
              imagePath: "http://image.com",
            }),
          ],
        });
        booking.addPayment(50);
        booking.informItemsDelivery();
        expect(booking.notification).notificationContainsErrorMessages([
          "Reserva ainda não foi paga",
        ]);
        expect(booking.notification.hasErrors()).toBe(true);
      });
    });

    it("should validate when canceling a booking with invalid status", () => {
      const booking = new Booking({
        id: BookingId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: DateVo.create("2024-09-01"),
        expectedBookingPeriod: new BookingPeriod({
          pickUpDate: DateVo.create("2024-08-31"),
          returnDate: DateVo.create("2024-09-02"),
        }),
        bookingPeriod: new BookingPeriod({
          pickUpDate: DateVo.create("2024-08-31"),
        }),
        dresses: [
          new BookingDressItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        clutches: [
          new BookingClutchItem({
            id: BookingDressItemId.random(),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 50,
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        status: BookingStatus.COMPLETED,
        amountPaid: 100,
      });
      booking.cancel();
      expect(booking.notification).notificationContainsErrorMessages([
        "Reserva já foi finalizada",
      ]);
      expect(booking.notification.hasErrors()).toBe(true);
    });

    it("should validate when completing a booking with canceled status", () => {
      const booking = new Booking({
        id: BookingId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: DateVo.create("2024-09-01"),
        expectedBookingPeriod: new BookingPeriod({
          pickUpDate: DateVo.create("2024-08-31"),
          returnDate: DateVo.create("2024-09-02"),
        }),
        bookingPeriod: new BookingPeriod({
          pickUpDate: DateVo.create("2024-08-31"),
        }),
        dresses: [
          BookingDressItem.create({
            id: BookingDressItemId.create(
              "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            ),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        status: BookingStatus.CANCELED,
        amountPaid: 100,
      });
      booking.complete();
      expect(booking.notification).notificationContainsErrorMessages([
        "Reserva já foi cancelada",
      ]);
      expect(booking.notification.hasErrors()).toBe(true);
    });

    it("should validate when completing a booking with canceled status", () => {
      const booking = new Booking({
        id: BookingId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        customerName: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: DateVo.create("2024-09-01"),
        expectedBookingPeriod: new BookingPeriod({
          pickUpDate: DateVo.create("2024-08-31"),
          returnDate: DateVo.create("2024-09-02"),
        }),
        dresses: [
          BookingDressItem.create({
            id: BookingDressItemId.create(
              "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            ),
            productId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
            rentPrice: 100,
            fabric: "Seda",
            color: "Azul",
            model: "Vestido de Festa",
            imagePath: "http://image.com",
          }),
        ],
        status: BookingStatus.PAYMENT_PENDING,
        amountPaid: 100,
      });
      booking.complete();
      expect(booking.notification).notificationContainsErrorMessages([
        "Reserva ainda não foi paga",
      ]);
      expect(booking.notification.hasErrors()).toBe(true);
    });
  });
});
