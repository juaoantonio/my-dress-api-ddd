import { BookingModelMapper } from "@core/booking/infra/typeorm/booking.model-mapper";
import { BookingModel } from "@core/booking/infra/typeorm/booking.model";
import { BookingItemModel } from "@core/booking/infra/typeorm/booking-item.model";
import {
  Booking,
  BookingId,
  BookingStatus,
} from "@core/booking/domain/booking.aggregate-root";
import {
  BookingItem,
  BookingItemId,
} from "@core/booking/domain/entities/booking-item.entity";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { BookingPeriod } from "@core/booking/domain/booking-period.vo";
import { Adjustment } from "@core/booking/domain/entities/vo/adjustment.vo";
import { v4 as uuidv4 } from "uuid";

describe("BookingModelMapper", () => {
  let mapper: BookingModelMapper;

  beforeEach(() => {
    mapper = new BookingModelMapper();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-10-01T00:00:00Z"));
  });

  describe("toEntity", () => {
    it("should map BookingModel to Booking entity correctly without optional fields", () => {
      // Arrange
      const bookingModel = new BookingModel();
      bookingModel.id = uuidv4();
      bookingModel.customerName = "John Doe";
      bookingModel.status = BookingStatus.PAYMENT_PENDING;
      bookingModel.eventDate = new Date("2024-10-04T22:51:22.124Z");
      bookingModel.amountPaid = 100.0;
      bookingModel.expectedPickUpDate = new Date("2024-10-03T22:51:22.124Z");
      bookingModel.expectedReturnDate = new Date("2024-10-05T22:51:22.124Z");
      bookingModel.items = [];

      // Act
      const booking = mapper.toEntity(bookingModel);

      // Assert
      expect(booking).toBeInstanceOf(Booking);
      expect(booking.getId().getValue()).toBe(bookingModel.id);
      expect(booking.getCustomerName()).toBe("John Doe");
      expect(booking.getStatus()).toBe(BookingStatus.PAYMENT_PENDING);
      expect(booking.getEventDate().getValue()).toEqual(
        new Date("2024-10-04T22:51:22.124Z"),
      );
      expect(booking.getAmountPaid()).toBe(100.0);
      expect(
        booking.getExpectedBookingPeriod().getPickUpDate().getValue(),
      ).toEqual(new Date("2024-10-03T22:51:22.124Z"));
      expect(
        booking.getExpectedBookingPeriod().getReturnDate().getValue(),
      ).toEqual(new Date("2024-10-05T22:51:22.124Z"));
      expect(booking.getBookingPeriod()).toBeUndefined();
      expect(booking.getItems()).toHaveLength(0);
    });

    it("should map BookingModel to Booking entity correctly with all fields", () => {
      // Arrange
      const bookingId = BookingId.create(uuidv4());

      const bookingItemModel = new BookingItemModel();
      bookingItemModel.id = uuidv4();
      bookingItemModel.productId = uuidv4();
      bookingItemModel.type = "dress";
      bookingItemModel.rentPrice = 150.0;
      bookingItemModel.isCourtesy = false;
      bookingItemModel.adjustments = [
        { label: "Size Adjustment", description: "Adjusted to size M" },
      ];

      const bookingModel = new BookingModel();
      bookingModel.id = bookingId.getValue();
      bookingModel.customerName = "Jane Smith";
      bookingModel.status = BookingStatus.READY;
      bookingModel.eventDate = new Date("2024-12-25T18:00:00.000Z");
      bookingModel.amountPaid = 200.0;
      bookingModel.expectedPickUpDate = new Date("2024-12-24T10:00:00.000Z");
      bookingModel.expectedReturnDate = new Date("2024-12-26T10:00:00.000Z");
      bookingModel.pickUpDate = new Date("2024-12-24T12:00:00.000Z");
      bookingModel.returnDate = new Date("2024-12-26T09:00:00.000Z");
      bookingModel.items = [bookingItemModel];

      // Act
      const booking = mapper.toEntity(bookingModel);

      // Assert
      expect(booking).toBeInstanceOf(Booking);
      expect(booking.getId().getValue()).toBe(bookingModel.id);
      expect(booking.getCustomerName()).toBe("Jane Smith");
      expect(booking.getStatus()).toBe(BookingStatus.READY);
      expect(booking.getEventDate().getValue()).toEqual(
        new Date("2024-12-25T18:00:00.000Z"),
      );
      expect(booking.getAmountPaid()).toBe(200.0);

      expect(
        booking.getExpectedBookingPeriod().getPickUpDate().getValue(),
      ).toEqual(new Date("2024-12-24T10:00:00.000Z"));
      expect(
        booking.getExpectedBookingPeriod().getReturnDate().getValue(),
      ).toEqual(new Date("2024-12-26T10:00:00.000Z"));

      expect(booking.getBookingPeriod()?.getPickUpDate().getValue()).toEqual(
        new Date("2024-12-24T12:00:00.000Z"),
      );
      expect(booking.getBookingPeriod()?.getReturnDate().getValue()).toEqual(
        new Date("2024-12-26T09:00:00.000Z"),
      );

      expect(booking.getItems()).toHaveLength(1);
      const item = booking.getItems()[0];
      expect(item).toBeInstanceOf(BookingItem);
      expect(item.getId().getValue()).toBe(bookingItemModel.id);
      expect(item.getProductId()).toBe(bookingItemModel.productId);
      expect(item.getType()).toBe("dress");
      expect(item.getRentPrice()).toBe(150.0);
      expect(item.getIsCourtesy()).toBe(false);
      expect(item.getAdjustments()).toEqual([
        new Adjustment("Size Adjustment", "Adjusted to size M"),
      ]);
    });

    it("should map BookingModel to Booking entity correctly without returnDate", () => {
      // Arrange
      const bookingId = BookingId.create(uuidv4());

      const bookingItemModel = new BookingItemModel();
      bookingItemModel.id = uuidv4();
      bookingItemModel.productId = uuidv4();
      bookingItemModel.type = "dress";
      bookingItemModel.rentPrice = 150.0;
      bookingItemModel.isCourtesy = false;
      bookingItemModel.adjustments = [
        { label: "Size Adjustment", description: "Adjusted to size M" },
      ];

      const bookingModel = new BookingModel();
      bookingModel.id = bookingId.getValue();
      bookingModel.customerName = "Jane Smith";
      bookingModel.status = BookingStatus.READY;
      bookingModel.eventDate = new Date("2024-12-25T18:00:00.000Z");
      bookingModel.amountPaid = 200.0;
      bookingModel.expectedPickUpDate = new Date("2024-12-24T10:00:00.000Z");
      bookingModel.expectedReturnDate = new Date("2024-12-26T10:00:00.000Z");
      bookingModel.pickUpDate = new Date("2024-12-24T12:00:00.000Z");
      bookingModel.items = [bookingItemModel];
      const booking = mapper.toEntity(bookingModel);
      expect(booking).toBeInstanceOf(Booking);
      expect(booking.getId().getValue()).toBe(bookingModel.id);
      expect(booking.getCustomerName()).toBe("Jane Smith");
      expect(booking.getStatus()).toBe(BookingStatus.READY);
      expect(booking.getEventDate().getValue()).toEqual(
        new Date("2024-12-25T18:00:00.000Z"),
      );
      expect(booking.getAmountPaid()).toBe(200.0);

      expect(
        booking.getExpectedBookingPeriod().getPickUpDate().getValue(),
      ).toEqual(new Date("2024-12-24T10:00:00.000Z"));
      expect(
        booking.getExpectedBookingPeriod().getReturnDate().getValue(),
      ).toEqual(new Date("2024-12-26T10:00:00.000Z"));

      expect(booking.getBookingPeriod()?.getPickUpDate().getValue()).toEqual(
        new Date("2024-12-24T12:00:00.000Z"),
      );
      expect(
        booking.getBookingPeriod()?.getReturnDate()?.getValue(),
      ).toBeUndefined();

      expect(booking.getItems()).toHaveLength(1);
      const item = booking.getItems()[0];
      expect(item).toBeInstanceOf(BookingItem);
      expect(item.getId().getValue()).toBe(bookingItemModel.id);
      expect(item.getProductId()).toBe(bookingItemModel.productId);
      expect(item.getType()).toBe("dress");
      expect(item.getRentPrice()).toBe(150.0);
      expect(item.getIsCourtesy()).toBe(false);
      expect(item.getAdjustments()).toEqual([
        new Adjustment("Size Adjustment", "Adjusted to size M"),
      ]);
    });
  });

  describe("toModel", () => {
    it("should map Booking entity to BookingModel correctly without optional fields", () => {
      // Arrange
      const bookingId = BookingId.create(uuidv4());

      const booking = new Booking({
        id: bookingId,
        customerName: "John Doe",
        amountPaid: 100.0,
        status: BookingStatus.PAYMENT_PENDING,
        eventDate: DateVo.create(new Date("2024-10-04T22:51:22.124Z")),
        expectedBookingPeriod: BookingPeriod.create({
          pickUpDate: DateVo.create(new Date("2024-10-03T22:51:22.124Z")),
          returnDate: DateVo.create(new Date("2024-10-05T22:51:22.124Z")),
        }),
        items: [],
      });

      // Act
      const bookingModel = mapper.toModel(booking);

      // Assert
      expect(bookingModel).toBeInstanceOf(BookingModel);
      expect(bookingModel.id).toBe(booking.getId().getValue());
      expect(bookingModel.customerName).toBe("John Doe");
      expect(bookingModel.status).toBe(BookingStatus.PAYMENT_PENDING);
      expect(bookingModel.eventDate).toEqual(
        new Date("2024-10-04T22:51:22.124Z"),
      );
      expect(bookingModel.amountPaid).toBe(100.0);
      expect(bookingModel.expectedPickUpDate).toEqual(
        new Date("2024-10-03T22:51:22.124Z"),
      );
      expect(bookingModel.expectedReturnDate).toEqual(
        new Date("2024-10-05T22:51:22.124Z"),
      );
      expect(bookingModel.pickUpDate).toBeUndefined();
      expect(bookingModel.returnDate).toBeUndefined();
      expect(bookingModel.items).toHaveLength(0);
    });

    it("should map Booking entity to BookingModel correctly with all fields", () => {
      // Arrange
      const bookingId = BookingId.create(uuidv4());

      const bookingItem = new BookingItem({
        id: BookingItemId.create(uuidv4()),
        productId: uuidv4(),
        type: "clutch",
        rentPrice: 50.0,
        isCourtesy: true,
        adjustments: [new Adjustment("Color Adjustment", "Changed to red")],
      });

      const booking = new Booking({
        id: bookingId,
        customerName: "Jane Smith",
        amountPaid: 200.0,
        status: BookingStatus.READY,
        eventDate: DateVo.create(new Date("2024-12-25T18:00:00.000Z")),
        expectedBookingPeriod: BookingPeriod.create({
          pickUpDate: DateVo.create(new Date("2024-12-24T10:00:00.000Z")),
          returnDate: DateVo.create(new Date("2024-12-26T10:00:00.000Z")),
        }),
        bookingPeriod: BookingPeriod.create({
          pickUpDate: DateVo.create(new Date("2024-12-24T12:00:00.000Z")),
          returnDate: DateVo.create(new Date("2024-12-26T09:00:00.000Z")),
        }),
        items: [bookingItem],
      });
      const bookingModel = mapper.toModel(booking);
      expect(bookingModel).toBeInstanceOf(BookingModel);
      expect(bookingModel.id).toBe(booking.getId().getValue());
      expect(bookingModel.customerName).toBe("Jane Smith");
      expect(bookingModel.status).toBe(BookingStatus.READY);
      expect(bookingModel.eventDate).toEqual(
        new Date("2024-12-25T18:00:00.000Z"),
      );
      expect(bookingModel.amountPaid).toBe(200.0);

      expect(bookingModel.expectedPickUpDate).toEqual(
        new Date("2024-12-24T10:00:00.000Z"),
      );
      expect(bookingModel.expectedReturnDate).toEqual(
        new Date("2024-12-26T10:00:00.000Z"),
      );

      expect(bookingModel.pickUpDate).toEqual(
        new Date("2024-12-24T12:00:00.000Z"),
      );
      expect(bookingModel.returnDate).toEqual(
        new Date("2024-12-26T09:00:00.000Z"),
      );

      expect(bookingModel.items).toHaveLength(1);
      const itemModel = bookingModel.items[0];
      expect(itemModel).toBeInstanceOf(BookingItemModel);
      expect(itemModel.id).toBe(bookingItem.getId().getValue());
      expect(itemModel.productId).toBe(bookingItem.getProductId());
      expect(itemModel.type).toBe("clutch");
      expect(itemModel.rentPrice).toBe(50.0);
      expect(itemModel.isCourtesy).toBe(true);
      expect(itemModel.adjustments).toEqual([
        { label: "Color Adjustment", description: "Changed to red" },
      ]);
    });
  });
});
