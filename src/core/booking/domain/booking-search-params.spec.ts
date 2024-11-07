import {
  BookingFilter,
  BookingSearchParams,
} from "@core/booking/domain/booking.repository";
import { BookingStatus } from "@core/booking/domain/booking.aggregate-root";

describe("BookingSearchParams", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-07-01T00:00:00.000Z"));
  });
  describe("create", () => {
    it("should create a new instance with default values", () => {
      const searchParams = BookingSearchParams.create();

      expect(searchParams).toBeInstanceOf(BookingSearchParams);
      expect(searchParams.filter).toBeNull();
      expect(searchParams.page).toBe(1);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.sortDir).toBeNull();
    });

    it("should create a new instance with provided filter values", () => {
      const filter: BookingFilter = {
        customerName: "John Doe",
        eventDate: "2024-07-01T00:00:00.000Z",
        expectedPickUpDate: "2024-07-10T00:00:00.000Z",
        expectedReturnDate: "2024-07-15T00:00:00.000Z",
        status: BookingStatus.IN_PROGRESS,
        includeArchived: true,
      };
      const searchParams = BookingSearchParams.create({
        filter,
        page: 2,
        perPage: 10,
        sort: "customerName",
        sortDir: "desc",
      });

      expect(searchParams).toBeInstanceOf(BookingSearchParams);
      expect(searchParams.filter).toEqual({
        customerName: "John Doe",
        eventDate: "2024-07-01T00:00:00.000Z",
        expectedPickUpDate: "2024-07-10T00:00:00.000Z",
        expectedReturnDate: "2024-07-15T00:00:00.000Z",
        status: BookingStatus.IN_PROGRESS,
        includeArchived: true,
      });
      expect(searchParams.page).toBe(2);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBe("customerName");
      expect(searchParams.sortDir).toBe("desc");
    });

    it("should create a new instance and ignore invalid filter values", () => {
      const filter: BookingFilter = {
        customerName: "",
        eventDate: "",
        expectedPickUpDate: "",
        expectedReturnDate: "",
        status: "" as BookingStatus,
        includeArchived: null,
      };
      const searchParams = BookingSearchParams.create({
        filter,
      });

      expect(searchParams).toBeInstanceOf(BookingSearchParams);
      expect(searchParams.filter).toBeNull();
    });

    it("should handle period directly provided in the filter", () => {
      const searchParams = BookingSearchParams.create({
        filter: {
          customerName: "John Doe",
          eventDate: "2024-07-01T00:00:00.000Z",
        },
      });

      expect(searchParams).toBeInstanceOf(BookingSearchParams);
      expect(searchParams.filter).toEqual({
        customerName: "John Doe",
        eventDate: "2024-07-01T00:00:00.000Z",
      });
      expect(searchParams.page).toBe(1);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.sortDir).toBeNull();
    });

    it("should create a new instance with partial valid filter values including available and period", () => {
      const searchParams = BookingSearchParams.create({
        filter: {
          customerName: "John Doe",
          eventDate: "2024-07-01T00:00:00.000Z",
          expectedPickUpDate: "2024-07-10T00:00:00.000Z",
        },
        page: 2,
        perPage: 10,
        sort: "model",
        sortDir: "desc",
      });

      expect(searchParams).toBeInstanceOf(BookingSearchParams);
      expect(searchParams.filter).toEqual({
        customerName: "John Doe",
        eventDate: "2024-07-01T00:00:00.000Z",
        expectedPickUpDate: "2024-07-10T00:00:00.000Z",
      });
      expect(searchParams.page).toBe(2);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBe("model");
      expect(searchParams.sortDir).toBe("desc");
    });
  });
});
