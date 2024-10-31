import { Booking } from "@core/booking/domain/booking.aggregate-root";
import { BookingDressItemFakeBuilder } from "@core/booking/domain/entities/booking-dress-item-fake.builder";
import { BookingFakeBuilder } from "@core/booking/domain/booking-fake.builder";
import { BookingClutchItemFakeBuilder } from "@core/booking/domain/entities/booking-clutch-item-fake.builder";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { BookingPeriod } from "@core/booking/domain/booking-period.vo";

describe("BookingFakeBuilder", () => {
  it("should create a Booking with default values", () => {
    const booking = BookingFakeBuilder.aBooking().build();
    expect(booking).toBeInstanceOf(Booking);
    expect(booking.getDresses()).toHaveLength(0);
    expect(booking.getClutches()).toHaveLength(0);
    expect(booking.getAmountPaid()).toBeDefined();
    expect(booking.getStatus()).toBeDefined();
  });

  it("should create a Booking with customized customer name", () => {
    const booking = BookingFakeBuilder.aBooking()
      .withCustomerName("Maria Silva")
      .build();
    expect(booking.getCustomerName()).toBe("Maria Silva");
  });

  it("should create a Booking with event date and booking periods", () => {
    const eventDate = DateVo.create("2022-12-31");
    const expectedPickUpDate = DateVo.create("2022-12-25");
    const expectedReturnDate = DateVo.create("2023-01-02");

    const booking = BookingFakeBuilder.aBooking()
      .withEventDate(eventDate)
      .withExpectedBookingPeriod(
        new BookingPeriod({
          pickUpDate: expectedPickUpDate,
          returnDate: expectedReturnDate,
        }),
      )
      .build();

    expect(booking.getEventDate()).toEqual(eventDate);
    expect(booking.getExpectedBookingPeriod().getPickUpDate()).toEqual(
      expectedPickUpDate,
    );
    expect(booking.getExpectedBookingPeriod().getReturnDate()).toEqual(
      expectedReturnDate,
    );
  });

  it("should allow customization of dresses and clutches", () => {
    const dresses = BookingDressItemFakeBuilder.theDressItems(2).build();
    const clutches = BookingClutchItemFakeBuilder.theClutchItems(2).build();
    const booking = BookingFakeBuilder.aBooking()
      .withDresses(dresses)
      .withClutches(clutches)
      .build();

    expect(booking.getDresses()).toHaveLength(2);
    expect(booking.getClutches()).toHaveLength(2);
  });

  it("should allow customization of amount paid", () => {
    const booking = BookingFakeBuilder.aBooking().withAmountPaid(250).build();
    expect(booking.getAmountPaid()).toBe(250);
  });
});
