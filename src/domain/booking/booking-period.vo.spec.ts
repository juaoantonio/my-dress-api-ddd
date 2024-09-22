import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateVo } from "@domain/booking/date.vo";
import { BookingPeriod } from "@domain/booking/booking-period.vo";

describe("BookingPeriod", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-08-30"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("constructor", () => {
    it("should create a new instance of BookingPeriod", () => {
      const bookingPeriod = new BookingPeriod({
        pickUpDate: DateVo.create(new Date("2024-08-30")),
        returnDate: DateVo.create(new Date("2024-08-31")),
      });

      expect(bookingPeriod).toBeDefined();
      expect(bookingPeriod.getPickUpDate().getDateFormatted()).toBe(
        "2024-08-30",
      );
      expect(bookingPeriod.getReturnDate()?.getDateFormatted()).toBe(
        "2024-08-31",
      );
      expect(bookingPeriod.getTotalDays()).toBe(1);
    });
  });

  describe("create", () => {
    it("should create a new instance of BookingPeriod", () => {
      const bookingPeriod = BookingPeriod.create({
        pickUpDate: DateVo.create(new Date("2024-08-30")),
        returnDate: DateVo.create(new Date("2024-08-31")),
      });

      expect(bookingPeriod).toBeDefined();
      expect(bookingPeriod.getPickUpDate().getDateFormatted()).toBe(
        "2024-08-30",
      );
      expect(bookingPeriod.getReturnDate()?.getDateFormatted()).toBe(
        "2024-08-31",
      );
      expect(bookingPeriod.getTotalDays()).toBe(1);
    });

    it("should throw an error if pick up date is before today", () => {
      expect(() => {
        BookingPeriod.create({
          pickUpDate: DateVo.create(new Date("2024-08-29")),
          returnDate: DateVo.create(new Date("2024-08-31")),
        });
      }).toThrowError("Pick up date cannot be in the past");
    });

    it("should throw an error if return date is before today", () => {
      expect(() => {
        BookingPeriod.create({
          pickUpDate: DateVo.create(new Date("2024-08-30")),
          returnDate: DateVo.create(new Date("2024-08-29")),
        });
      }).toThrowError("Return date cannot be in the past");
    });

    it("should throw an error if pick up date is after return date", () => {
      expect(() => {
        BookingPeriod.create({
          pickUpDate: DateVo.create(new Date("2024-08-31")),
          returnDate: DateVo.create(new Date("2024-08-30")),
        });
      }).toThrowError("Pick up date cannot be after return date");
    });
  });
});
