// clutch.typeorm-repository.spec.ts

import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { ClutchTypeormRepository } from "@core/products/infra/db/typeorm/clutch/clutch.typeorm-repository";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { v4 as uuidv4 } from "uuid";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import {
  ClutchSearchParams,
  ClutchSearchResult,
} from "@core/products/domain/clutch/clutch.repository";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InvalidSearchParamsError } from "@core/@shared/domain/error/invalid-search-params.error";

describe("ClutchTypeormRepository Integration Test", async () => {
  let repository: ClutchTypeormRepository;
  const container = await new PostgreSqlContainer().start();
  const setup = setupTypeOrmForIntegrationTests({
    type: "postgres",
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    entities: [ClutchModel],
  });

  beforeEach(async () => {
    const modelRepository = setup.dataSource.getRepository(ClutchModel);
    repository = new ClutchTypeormRepository(modelRepository);
  });

  describe("search", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-10-01T00:00:00.000Z"));
    });
    // **Testes para Disponíveis (`available: true`)**

    it("should return all available clutches when no reservation periods are set", async () => {
      const clutch1 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch1.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const clutch2 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch2.png",
        model: "Casual Clutch",
        color: "Blue",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([clutch1, clutch2]);

      const searchParams = ClutchSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-01T00:00:00.000Z",
          endDate: "2024-10-05T00:00:00.000Z",
        },
      });

      const searchResult: ClutchSearchResult =
        await repository.search(searchParams);

      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(clutch1);
      expect(searchResult.items).toContainEqual(clutch2);
      expect(searchResult.total).toBe(2);
      expect(searchResult.currentPage).toBe(1);
      expect(searchResult.perPage).toBe(15); // Valor padrão
    });

    it("should return available clutches when reservations do not overlap with the requested period", async () => {
      const clutch1 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch1.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-15T00:00:00Z").toISOString(),
          },
        ],
      });

      const clutch2 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch2.png",
        model: "Casual Clutch",
        color: "Blue",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([clutch1, clutch2]);

      const searchParams = ClutchSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-05T00:00:00.000Z",
          endDate: "2024-10-09T00:00:00.000Z",
        },
      });

      const searchResult: ClutchSearchResult =
        await repository.search(searchParams);

      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(clutch1);
      expect(searchResult.items).toContainEqual(clutch2);
      expect(searchResult.total).toBe(2);
    });

    it("should return only clutches without overlapping reservations for available=true", async () => {
      const clutch1 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch1.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-15T00:00:00Z").toISOString(),
          },
        ],
      });

      const clutch2 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch2.png",
        model: "Casual Clutch",
        color: "Blue",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([clutch1, clutch2]);

      const searchParams = ClutchSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-05T00:00:00.000Z",
          endDate: "2024-10-09T00:00:00.000Z",
        },
      });

      const searchResult: ClutchSearchResult =
        await repository.search(searchParams);

      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(clutch1);
      expect(searchResult.items).toContainEqual(clutch2);
      expect(searchResult.total).toBe(2);
    });

    it("should return unavailable clutches for the given period when available=false", async () => {
      const clutch1 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch1.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-15T00:00:00Z").toISOString(),
          },
        ],
      });

      const clutch2 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch2.png",
        model: "Summer Clutch",
        color: "Yellow",
        rentPrice: 180.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-08T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-12T00:00:00Z").toISOString(),
          },
        ],
      });

      await repository.saveMany([clutch1, clutch2]);

      const searchParams = ClutchSearchParams.create({
        filter: {
          available: false,
          startDate: "2024-10-09T00:00:00.000Z",
          endDate: "2024-10-11T00:00:00.000Z",
        },
      });

      const searchResult: ClutchSearchResult =
        await repository.search(searchParams);

      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(clutch1);
      expect(searchResult.items).toContainEqual(clutch2);
      expect(searchResult.total).toBe(2);
    });

    // **Casos de Borda**

    it("should return no clutches available when all have overlapping reservations", async () => {
      const clutch1 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch1.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-01T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-10T00:00:00Z").toISOString(),
          },
        ],
      });

      const clutch2 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch2.png",
        model: "Summer Clutch",
        color: "Yellow",
        rentPrice: 180.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-05T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-15T00:00:00Z").toISOString(),
          },
        ],
      });

      await repository.saveMany([clutch1, clutch2]);

      const searchParams = ClutchSearchParams.create({
        filter: {
          available: false,
          startDate: "2024-10-07T00:00:00.000Z",
          endDate: "2024-10-12T00:00:00.000Z",
        },
      });

      const searchResult: ClutchSearchResult =
        await repository.search(searchParams);

      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(clutch1);
      expect(searchResult.items).toContainEqual(clutch2);
      expect(searchResult.total).toBe(2);
    });

    it("should handle period boundaries correctly for available=true", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-15T00:00:00Z").toISOString(),
          },
        ],
      });

      await repository.save(clutch);

      const searchParams1 = ClutchSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-05T00:00:00.000Z",
          endDate: "2024-10-09T00:00:00.000Z",
        },
      });

      const searchResult1: ClutchSearchResult =
        await repository.search(searchParams1);
      expect(searchResult1.items).toHaveLength(1);
      expect(searchResult1.items[0].equals(clutch)).toBe(true);

      const searchParams2 = ClutchSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-16T00:00:00.000Z",
          endDate: "2024-10-20T00:00:00.000Z",
        },
      });

      const searchResult2: ClutchSearchResult =
        await repository.search(searchParams2);
      expect(searchResult2.items).toHaveLength(1);
      expect(searchResult2.items[0].equals(clutch)).toBe(true);
    });

    it("should throw InvalidSearchParamsError when available=true but period dates are missing", () => {
      expect(() =>
        ClutchSearchParams.create({
          filter: {
            available: true,
            // startDate e endDate estão faltando
          },
        }),
      ).toThrow(InvalidSearchParamsError);
    });

    it("should create a new instance with available=false and period provided", () => {
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

    it("should handle period directly provided in the filter", () => {
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
      expect(searchParams.perPage).toBe(15);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.sortDir).toBeNull();
    });

    it("should create a new instance with partial valid filter values including available and period", () => {
      const searchParams = ClutchSearchParams.create({
        filter: {
          model: "Summer Clutch",
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
        model: "Summer Clutch",
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

    // **Testes de Paginação e Ordenação**

    it("should return clutches with pagination and sorting", async () => {
      // Criando três registros no banco de dados
      const clutch1 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch1.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const clutch2 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch2.png",
        model: "Casual Clutch",
        color: "Blue",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const clutch3 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch3.png",
        model: "Summer Clutch",
        color: "Yellow",
        rentPrice: 180.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([clutch1, clutch2, clutch3]);

      // Criando os parâmetros de busca com paginação e ordenação
      const searchParams = ClutchSearchParams.create({
        page: 1,
        perPage: 2,
        sort: "model",
        sortDir: "asc",
        filter: {
          color: "Red", // Testando com filtro por cor
        },
      });

      // Realizando a busca
      const searchResult: ClutchSearchResult =
        await repository.search(searchParams);

      // Verificando o resultado da busca
      expect(searchResult.items).toHaveLength(1); // Só um clutch tem a cor "Red"
      expect(searchResult.items[0].getModel()).toBe("Evening Clutch");
      expect(searchResult.items[0].getColor()).toBe("Red");

      // Verificando as propriedades da paginação
      expect(searchResult.total).toBe(1); // Apenas um item corresponde ao filtro
      expect(searchResult.currentPage).toBe(1);
      expect(searchResult.perPage).toBe(2);
    });

    it("should return clutches sorted by rentPrice in descending order", async () => {
      const clutch1 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch1.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const clutch2 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch2.png",
        model: "Casual Clutch",
        color: "Blue",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const clutch3 = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch3.png",
        model: "Summer Clutch",
        color: "Yellow",
        rentPrice: 180.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([clutch1, clutch2, clutch3]);

      // Criando os parâmetros de busca com ordenação por preço
      const searchParams = ClutchSearchParams.create({
        page: 1,
        perPage: 3,
        sort: "rentPrice",
        sortDir: "desc",
      });

      // Realizando a busca
      const searchResult: ClutchSearchResult =
        await repository.search(searchParams);

      // Verificando a ordenação dos itens
      expect(searchResult.items).toHaveLength(3);
      expect(searchResult.items[0].getRentPrice()).toBe(200.0); // Maior preço
      expect(searchResult.items[1].getRentPrice()).toBe(180.0);
      expect(searchResult.items[2].getRentPrice()).toBe(150.0); // Menor preço
    });

    it("should return no clutches if filter does not match", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(clutch);

      // Criando os parâmetros de busca com um filtro que não existe
      const searchParams = ClutchSearchParams.create({
        page: 1,
        perPage: 10,
        filter: {
          color: "Green", // Nenhum clutch tem a cor "Green"
        },
      });

      // Realizando a busca
      const searchResult: ClutchSearchResult =
        await repository.search(searchParams);

      // Verificando que nenhum item foi retornado
      expect(searchResult.items).toHaveLength(0);
      expect(searchResult.total).toBe(0);
    });
  });

  // **Testes de Salvar, Deletar, e Existência**

  describe("save", () => {
    it("should save a clutch entity successfully", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(clutch);
      const savedClutch = await repository.findById(clutch.getId());
      expect(savedClutch?.equals(clutch)).toBe(true);
    });
  });

  describe("delete", () => {
    it("should delete a clutch entity successfully", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(clutch);
      await repository.delete(clutch.getId());
      const deletedClutch = await repository.findById(clutch.getId());
      expect(deletedClutch).toBeNull();
    });
  });

  describe("existsById", () => {
    it("should correctly identify existing and non-existing clutch ids", async () => {
      const clutch = Clutch.create({
        id: uuidv4(),
        imagePath: "https://example.com/clutch.png",
        model: "Evening Clutch",
        color: "Red",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(clutch);

      const result = await repository.existsById([
        clutch.getId(),
        ClutchId.random(),
      ]);
      expect(result.exists).toContainEqual(clutch.getId());
      expect(result.notExists).toHaveLength(1);
    });
  });
});
