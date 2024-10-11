// dress.typeorm-repository.spec.ts

import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { v4 as uuidv4 } from "uuid";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import {
  DressSearchParams,
  DressSearchResult,
} from "@core/products/domain/dress/dress.repository";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("DressTypeormRepository Integration Test", async () => {
  let repository: DressTypeormRepository;
  const container = await new PostgreSqlContainer().start();
  const setup = setupTypeOrmForIntegrationTests({
    type: "postgres",
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    entities: [DressModel],
  });

  beforeEach(async () => {
    const modelRepository = setup.dataSource.getRepository(DressModel);
    repository = new DressTypeormRepository(modelRepository);
  });

  afterAll(async () => {
    await setup.dataSource.destroy();
    await container.stop();
  });

  describe("search", () => {
    // **Testes para Disponíveis (`available: true`)**
    beforeEach(async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-09-30T00:00:00.000Z"));
    });

    it("should return all available dresses when no reservation periods are set", async () => {
      const dress1 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress1.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const dress2 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress2.png",
        model: "Casual Dress",
        color: "Blue",
        fabric: "Cotton",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([dress1, dress2]);

      const searchParams = DressSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-01T00:00:00.000Z",
          endDate: "2024-10-05T00:00:00.000Z",
        },
      });

      const searchResult: DressSearchResult =
        await repository.search(searchParams);

      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(dress1);
      expect(searchResult.items).toContainEqual(dress2);
      expect(searchResult.total).toBe(2);
      expect(searchResult.currentPage).toBe(1);
      expect(searchResult.perPage).toBe(15); // Valor padrão
    });

    it("should return available dresses when reservations do not overlap with the requested period", async () => {
      const dress1 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress1.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-15T00:00:00Z").toISOString(),
          },
        ],
      });

      const dress2 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress2.png",
        model: "Casual Dress",
        color: "Blue",
        fabric: "Cotton",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([dress1, dress2]);

      const searchParams = DressSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-05T00:00:00.000Z",
          endDate: "2024-10-09T00:00:00.000Z",
        },
      });

      const searchResult: DressSearchResult =
        await repository.search(searchParams);

      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(dress1);
      expect(searchResult.items).toContainEqual(dress2);
      expect(searchResult.total).toBe(2);
    });

    it("should return only dresses without overlapping reservations for available=true", async () => {
      const dress1 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress1.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-15T00:00:00Z").toISOString(),
          },
        ],
      });

      const dress2 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress2.png",
        model: "Casual Dress",
        color: "Blue",
        fabric: "Cotton",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([dress1, dress2]);

      const searchParams = DressSearchParams.create({
        filter: {
          available: true,
          startDate: "2024-10-05T00:00:00.000Z",
          endDate: "2024-10-09T00:00:00.000Z",
        },
      });

      const searchResult: DressSearchResult =
        await repository.search(searchParams);

      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(dress1);
      expect(searchResult.items).toContainEqual(dress2);
      expect(searchResult.total).toBe(2);
    });

    it("should return unavailable dresses for the given period when available=false", async () => {
      const dress1 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress1.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-15T00:00:00Z").toISOString(),
          },
        ],
      });
      const dress2 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress2.png",
        model: "Casual Dress",
        color: "Blue",
        fabric: "Cotton",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([dress1, dress2]);

      const searchParams = DressSearchParams.create({
        filter: {
          available: false,
          startDate: "2024-10-12T00:00:00.000Z",
          endDate: "2024-10-18T00:00:00.000Z",
        },
      });
      const searchResult: DressSearchResult =
        await repository.search(searchParams);
      expect(searchResult.items).toHaveLength(1);
      expect(searchResult.items[0].equals(dress1)).toBe(true);
      expect(searchResult.total).toBe(1);
    });

    it("should return multiple unavailable dresses for overlapping periods", async () => {
      const dress1 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress1.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-05T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-10T00:00:00Z").toISOString(),
          },
        ],
      });
      const dress2 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress2.png",
        model: "Summer Dress",
        color: "Yellow",
        fabric: "Linen",
        rentPrice: 180.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-08T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-12T00:00:00Z").toISOString(),
          },
        ],
      });
      await repository.saveMany([dress1, dress2]);
      const searchParams = DressSearchParams.create({
        filter: {
          available: false,
          startDate: "2024-10-09T00:00:00.000Z",
          endDate: "2024-10-11T00:00:00.000Z",
        },
      });
      const searchResult: DressSearchResult =
        await repository.search(searchParams);
      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(dress1);
      expect(searchResult.items).toContainEqual(dress2);
      expect(searchResult.total).toBe(2);
    });

    // **Casos de Borda**
    it("should return no dresses available when all have overlapping reservations", async () => {
      const dress1 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress1.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-01T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-10T00:00:00Z").toISOString(),
          },
        ],
      });
      const dress2 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress2.png",
        model: "Summer Dress",
        color: "Yellow",
        fabric: "Linen",
        rentPrice: 180.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-05T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-15T00:00:00Z").toISOString(),
          },
        ],
      });
      await repository.saveMany([dress1, dress2]);
      const searchParams = DressSearchParams.create({
        filter: {
          available: false,
          startDate: "2024-10-07T00:00:00.000Z",
          endDate: "2024-10-12T00:00:00.000Z",
        },
      });
      const searchResult: DressSearchResult =
        await repository.search(searchParams);
      expect(searchResult.items).toHaveLength(2);
      expect(searchResult.items).toContainEqual(dress1);
      expect(searchResult.items).toContainEqual(dress2);
      expect(searchResult.total).toBe(2);
    });

    // **Testes de Paginação e Ordenação**

    it("should return dresses with pagination and sorting", async () => {
      // Criando três registros no banco de dados
      const dress1 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress1.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const dress2 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress2.png",
        model: "Casual Dress",
        color: "Blue",
        fabric: "Cotton",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const dress3 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress3.png",
        model: "Summer Dress",
        color: "Yellow",
        fabric: "Linen",
        rentPrice: 180.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([dress1, dress2, dress3]);

      // Criando os parâmetros de busca com paginação e ordenação
      const searchParams = DressSearchParams.create({
        page: 1,
        perPage: 2,
        sort: "model",
        sortDir: "asc",
        filter: {
          color: "Red", // Testando com filtro por cor
        },
      });

      // Realizando a busca
      const searchResult: DressSearchResult =
        await repository.search(searchParams);

      // Verificando o resultado da busca
      expect(searchResult.items).toHaveLength(1); // Só um vestido tem a cor "Red"
      expect(searchResult.items[0].getModel()).toBe("Evening Dress");
      expect(searchResult.items[0].getColor()).toBe("Red");

      // Verificando as propriedades da paginação
      expect(searchResult.total).toBe(1); // Apenas um item corresponde ao filtro
      expect(searchResult.currentPage).toBe(1);
      expect(searchResult.perPage).toBe(2);
    });

    it("should return dresses sorted by rentPrice in descending order", async () => {
      const dress1 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress1.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const dress2 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress2.png",
        model: "Casual Dress",
        color: "Blue",
        fabric: "Cotton",
        rentPrice: 150.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      const dress3 = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress3.png",
        model: "Summer Dress",
        color: "Yellow",
        fabric: "Linen",
        rentPrice: 180.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.saveMany([dress1, dress2, dress3]);

      // Criando os parâmetros de busca com ordenação por preço
      const searchParams = DressSearchParams.create({
        page: 1,
        perPage: 3,
        sort: "rentPrice",
        sortDir: "desc",
      });

      // Realizando a busca
      const searchResult: DressSearchResult =
        await repository.search(searchParams);

      // Verificando a ordenação dos itens
      expect(searchResult.items).toHaveLength(3);
      expect(searchResult.items[0].getRentPrice()).toBe(200.0); // Maior preço
      expect(searchResult.items[1].getRentPrice()).toBe(180.0);
      expect(searchResult.items[2].getRentPrice()).toBe(150.0); // Menor preço
    });

    it("should return no dresses if filter does not match", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(dress);

      // Criando os parâmetros de busca com um filtro que não existe
      const searchParams = DressSearchParams.create({
        page: 1,
        perPage: 10,
        filter: {
          color: "Green", // Nenhum vestido tem a cor "Green"
        },
      });

      // Realizando a busca
      const searchResult: DressSearchResult =
        await repository.search(searchParams);

      // Verificando que nenhum item foi retornado
      expect(searchResult.items).toHaveLength(0);
      expect(searchResult.total).toBe(0);
    });
  });

  // **Testes de Salvar, Deletar, e Existência**

  describe("save", () => {
    it("should save a dress entity successfully", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(dress);
      const savedDress = await repository.findById(dress.getId());
      expect(savedDress?.equals(dress)).toBe(true);
    });
  });

  describe("delete", () => {
    it("should delete a dress entity successfully", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });
      await repository.save(dress);
      await repository.delete(dress.getId());
      const deletedDress = await repository.findById(dress.getId());
      expect(deletedDress).toBeNull();
    });
  });

  describe("existsById", () => {
    it("should correctly identify existing and non-existing dress ids", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [],
      });

      await repository.save(dress);

      const result = await repository.existsById([
        dress.getId(),
        DressId.create(uuidv4()), // ID aleatório não existente
      ]);
      expect(result.exists).toContainEqual(dress.getId());
      expect(result.notExists).toHaveLength(1);
    });
  });
});
