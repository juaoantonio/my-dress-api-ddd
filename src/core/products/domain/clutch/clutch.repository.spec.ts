// clutch.search-params.spec.ts

import { describe, expect, it } from "vitest";
import {
  ClutchFilter,
  ClutchSearchParams,
} from "@core/products/domain/clutch/clutch.repository";
import { InvalidSearchParamsError } from "@core/@shared/domain/error/invalid-search-params.error";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";

describe("ClutchSearchParams", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-10-01T00:00:00.000Z"));
  });
  describe("create", () => {
    it("deve criar uma nova instância com valores padrão quando nenhum filtro é fornecido", () => {
      const searchParams = ClutchSearchParams.create();

      expect(searchParams).toBeInstanceOf(ClutchSearchParams);
      expect(searchParams.filter).toBeNull();
      expect(searchParams.page).toBe(1);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.sortDir).toBeNull();
    });

    it("deve criar uma nova instância com valores de filtro fornecidos", () => {
      const filter: ClutchFilter = {
        color: "Preto",
        model: "Clutch Elegante",
        rentPrice: 250.0,
      };
      const searchParams = ClutchSearchParams.create({
        filter,
        page: 2,
        perPage: 10,
        sort: "model",
        sortDir: "desc",
      });

      expect(searchParams).toBeInstanceOf(ClutchSearchParams);
      expect(searchParams.filter).toEqual({
        color: "Preto",
        model: "Clutch Elegante",
        rentPrice: 250.0,
      });
      expect(searchParams.page).toBe(2);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBe("model");
      expect(searchParams.sortDir).toBe("desc");
    });

    it("deve ignorar valores de filtro inválidos e retornar filter como null", () => {
      const filter: ClutchFilter = {
        color: "",
        model: "",
        rentPrice: 0,
      };
      const searchParams = ClutchSearchParams.create({
        filter,
      });

      expect(searchParams).toBeInstanceOf(ClutchSearchParams);
      expect(searchParams.filter).toBeNull();
    });

    // **Novos Testes Adicionados**

    it("deve criar uma nova instância com available=true e período válido", () => {
      const searchParams = ClutchSearchParams.create({
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

      expect(searchParams).toBeInstanceOf(ClutchSearchParams);
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

    it("deve lançar InvalidSearchParamsError quando available=true mas startDate ou endDate estão faltando", () => {
      expect(() =>
        ClutchSearchParams.create({
          filter: {
            available: true,
          },
        }),
      ).toThrow(InvalidSearchParamsError);
    });

    it("deve criar uma nova instância com available=false e período fornecido", () => {
      const searchParams = ClutchSearchParams.create({
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

      expect(searchParams).toBeInstanceOf(ClutchSearchParams);
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

    it("deve lidar com período fornecido diretamente no filtro", () => {
      const period = Period.create({
        startDate: DateVo.create("2024-12-01T00:00:00.000Z"),
        endDate: DateVo.create("2024-12-15T00:00:00.000Z"),
      });

      const searchParams = ClutchSearchParams.create({
        filter: {
          available: true,
          startDate: period.getStartDate().getValue().toISOString(),
          endDate: period.getEndDate().getValue().toISOString(),
        },
      });

      expect(searchParams).toBeInstanceOf(ClutchSearchParams);
      expect(searchParams.filter).toEqual({
        available: true,
        period,
      });
      expect(searchParams.page).toBe(1);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.sortDir).toBeNull();
    });

    it("deve criar uma nova instância com valores de filtro parcialmente válidos incluindo available e período", () => {
      const searchParams = ClutchSearchParams.create({
        filter: {
          model: "Clutch de Verão",
          available: true,
          startDate: "2024-10-01T00:00:00.000Z",
          endDate: "2024-10-15T00:00:00.000Z",
        },
        page: 2,
        perPage: 10,
        sort: "model",
        sortDir: "desc",
      });

      expect(searchParams).toBeInstanceOf(ClutchSearchParams);
      expect(searchParams.filter).toEqual({
        model: "Clutch de Verão",
        available: true,
        period: Period.create({
          startDate: DateVo.create("2024-10-01T00:00:00.000Z"),
          endDate: DateVo.create("2024-10-15T00:00:00.000Z"),
        }),
      });
      expect(searchParams.page).toBe(2);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sort).toBe("model");
      expect(searchParams.sortDir).toBe("desc");
    });
  });
});
