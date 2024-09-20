import { describe, expect, it } from "vitest";
import { DressId } from "@domain/dress/dress-id.vo";
import { ClutchId } from "@domain/clutch/clutch-id.vo";
import { BookingPeriod } from "@domain/booking/booking-period.vo";
import {
  Booking,
  BookingId,
  BookingPaymentStatus,
  BookingStatus,
} from "@domain/booking/booking.aggregate";

describe("Booking Aggregate Unit Tests", function () {
  describe("Booking Create Constructor", function () {
    it("should create a valid booking", () => {
      const booking = new Booking({
        id: BookingId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        customerId: "81d4babd-9644-4b6a-afaf-930f6608f6d5",
        eventDate: new Date("2024-09-01"),
        expectedBookingPeriod: new BookingPeriod({
          pickUpDate: new Date("2024-08-31"),
          returnDate: new Date("2024-09-02"),
        }),
        bookingPeriod: new BookingPeriod({
          pickUpDate: new Date("2024-08-31"),
          returnDate: new Date("2024-09-02"),
        }),
        dresses: [
          DressId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
          DressId.create("81d4babd-8644-4b6a-afaf-930f6608f6d5"),
        ],
        clutches: [
          ClutchId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
          ClutchId.create("81d4babd-8644-4b6a-afaf-930f6608f6d5"),
        ],
        status: BookingStatus.PAYMENT_PENDING,
        paymentStatus: BookingPaymentStatus.PENDING,
      });

      expect(booking.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(booking.getCustomerId()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(booking.getEventDate().getValue()).toBe("2024-09-01");
      expect(booking.getBookingPeriod().getPickUpDate().getValue()).toBe(
        "2024-08-31",
      );
      expect(booking.getBookingPeriod().getReturnDate().getValue()).toBe(
        "2024-09-02",
      );
      expect(booking.getBookingPeriod().getTotalDays()).toBe(2);
      expect(
        booking.getExpectedBookingPeriod().getPickUpDate().getValue(),
      ).toBe("2024-08-31");
      expect(
        booking.getExpectedBookingPeriod().getReturnDate().getValue(),
      ).toBe("2024-09-02");
      expect(booking.getExpectedBookingPeriod().getTotalDays()).toBe(2);
      expect(booking.getDresses().length).toBe(2);
      expect(booking.getClutches().length).toBe(2);
    });
  });

  describe("Booking Create Factory Method", function () {});

  describe("Booking Behavior Methods", function () {});

  describe("Booking Validation", function () {
    describe("Validate Booking Creation", function () {});

    describe("Validate Booking Behavior Methods", function () {});
  });
});
