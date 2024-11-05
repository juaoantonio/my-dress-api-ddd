import { DressFilter, DressSearchParams } from "./dress.repository";
import { describe, expect, it } from "vitest";
import { InvalidSearchParamsError } from "@core/@shared/domain/error/invalid-search-params.error";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";

describe("DressSearchParams", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-07-01T00:00:00.000Z"));
  });
  describe("create", () => {
    it("should create a new instance with default values", () => {
      const searchParams = DressSearchParams.create();

      expect(searchParams).toBeInstanceOf(DressSearchParams);
      expect(searchParams.filter).toBeNull();
      expect(searchParams.page).toBe(1);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.sortDir).toBeNull();
    });

    it("should create a new instance with provided filter values", () => {
      const filter: DressFilter = {
        color: "Red",
        model: "Evening Gown",
        fabric: "Silk",
        rentPrice: 100,
      };
      const searchParams = DressSearchParams.create({
        filter,
        page: 2,
        perPage: 10,
        sort: "model",
        sortDir: "desc",
      });

      expect(searchParams).toBeInstanceOf(DressSearchParams);
      expect(searchParams.filter).toEqual({
        color: "Red",
        model: "Evening Gown",
        fabric: "Silk",
        rentPrice: 100,
      });
      expect(searchParams.page).toBe(2);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBe("model");
      expect(searchParams.sortDir).toBe("desc");
    });

    it("should create a new instance and ignore invalid filter values", () => {
      const filter: DressFilter = {
        color: "",
        model: "",
        fabric: "",
        rentPrice: 0,
      };
      const searchParams = DressSearchParams.create({
        filter,
      });

      expect(searchParams).toBeInstanceOf(DressSearchParams);
      expect(searchParams.filter).toBeNull();
    });

    // **Novos Testes Adicionados**

    it("should create a new instance with available true and valid period", () => {
      const searchParams = DressSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-01T00:00:00.000Z",
          endDate: "2024-10-10T00:00:00.000Z",
        },
        page: 1,
        perPage: 20,
        sort: "rentPrice",
        sortDir: "asc",
      });

      expect(searchParams).toBeInstanceOf(DressSearchParams);
      expect(searchParams.filter).toEqual({
        available: true,
        period: Period.create({
          startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
          endDate: DateVo.create("2024-10-10T00:00:00.000Z"),
        }),
      });
      expect(searchParams.page).toBe(1);
      expect(searchParams.perPage).toBe(20);
      expect(searchParams.sort).toBe("rentPrice");
      expect(searchParams.sortDir).toBe("asc");
    });

    it("should throw InvalidSearchParamsError when available is true but period dates are missing", () => {
      expect(() =>
        DressSearchParams.create({
          filter: {
            available: false,
          },
          page: 3,
          perPage: 5,
          sort: "color",
          sortDir: "asc",
        }),
      ).toThrow(InvalidSearchParamsError);
    });

    it("should create a new instance with available false and period provided", () => {
      const searchParams = DressSearchParams.create({
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

      expect(searchParams).toBeInstanceOf(DressSearchParams);
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

    it("should handle period directly provided in the filter", () => {
      const period = Period.create({
        startDate: DateVo.create("2024-07-01T00:00:00.000Z"),
        endDate: DateVo.create("2024-07-15T00:00:00.000Z"),
      });

      const searchParams = DressSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-07-01T00:00:00.000Z",
          endDate: "2024-07-15T00:00:00.000Z",
        },
      });

      expect(searchParams).toBeInstanceOf(DressSearchParams);
      expect(searchParams.filter).toEqual({
        available: true,
        period,
      });
      expect(searchParams.page).toBe(1);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.sortDir).toBeNull();
    });

    it("should create a new instance with partial valid filter values including available and period", () => {
      const searchParams = DressSearchParams.create({
        filter: {
          model: "Summer Dress",
          available: true,
          startDate: "2024-07-01T00:00:00.000Z",
          endDate: "2024-07-15T00:00:00.000Z",
        },
        page: 2,
        perPage: 10,
        sort: "model",
        sortDir: "desc",
      });

      expect(searchParams).toBeInstanceOf(DressSearchParams);
      expect(searchParams.filter).toEqual({
        model: "Summer Dress",
        available: true,
        period: Period.create({
          startDate: DateVo.create("2024-07-01T00:00:00.000Z"),
          endDate: DateVo.create("2024-07-15T00:00:00.000Z"),
        }),
      });
      expect(searchParams.page).toBe(2);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBe("model");
      expect(searchParams.sortDir).toBe("desc");
    });
  });
});
