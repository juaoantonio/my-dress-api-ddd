import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";
import { v4 as uuidv4 } from "uuid";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import {
  DressSearchParams,
  DressSearchResult,
} from "@core/products/domain/dress/dress.repository";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { it } from "vitest";

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

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-10-01"));

    const modelRepository = setup.dataSource.getRepository(DressModel);
    repository = new DressTypeormRepository(modelRepository);
  });

  describe("getAllAvailableForPeriod", () => {
    it("should return all dresses available when no reservation periods are set", async () => {
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

      const period = new Period({
        startDate: DateVo.create("2024-10-01"),
        endDate: DateVo.create("2024-10-05"),
      });

      const availableDresses =
        await repository.getAllAvailableForPeriod(period);
      expect(availableDresses).toHaveLength(2);
      expect(availableDresses[0].equals(dress1)).toBe(true);
      expect(availableDresses[1].equals(dress2)).toBe(true);
    });

    it("should return all dresses available when the requested period is before the first reservation period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10").toISOString(),
            endDate: new Date("2024-10-15").toISOString(),
          },
          {
            startDate: new Date("2024-10-16").toISOString(),
            endDate: new Date("2024-10-20").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-07"),
        endDate: DateVo.create("2024-10-09"),
      });

      const availableDresses =
        await repository.getAllAvailableForPeriod(period);
      expect(availableDresses).toHaveLength(1);
      expect(availableDresses[0].equals(dress)).toBe(true);
    });

    it("should return an empty array when no dresses are available for the given period in between the each of reservation periods", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-01").toISOString(),
            endDate: new Date("2024-10-10").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-01"),
        endDate: DateVo.create("2024-10-05"),
      });

      const availableDresses =
        await repository.getAllAvailableForPeriod(period);
      expect(availableDresses).toHaveLength(0);
    });

    it("should return no dresses available for the given period when the reservation starts before the requested period and ends within the requested period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10").toISOString(),
            endDate: new Date("2024-10-15").toISOString(),
          },
        ],
      });
      await repository.save(dress);
      const period = new Period({
        startDate: DateVo.create("2024-10-09"),
        endDate: DateVo.create("2024-10-11"),
      });
      const availableDresses =
        await repository.getAllAvailableForPeriod(period);
      expect(availableDresses).toHaveLength(0);
    });

    it("should return no dresses available for the given period when the reservation starts within the requested period and ends after the requested period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10").toISOString(),
            endDate: new Date("2024-10-15").toISOString(),
          },
        ],
      });
      await repository.save(dress);
      const period = new Period({
        startDate: DateVo.create("2024-10-11"),
        endDate: DateVo.create("2024-10-20"),
      });
      const availableDresses =
        await repository.getAllAvailableForPeriod(period);
      expect(availableDresses).toHaveLength(0);
    });

    it("should return no dresses available when the requested period endDate is the same as the reservation startDate", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
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
          {
            startDate: new Date("2024-10-16T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-20T00:00:00Z").toISOString(),
          },
        ],
      });
      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-08T00:00:00Z"),
        endDate: DateVo.create("2024-10-10T00:00:00Z"),
      });

      const availableDresses =
        await repository.getAllAvailableForPeriod(period);
      expect(availableDresses).toHaveLength(0);
    });

    it("should return no dresses available when the requested period startDate is the same as the reservation endDate", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
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
          {
            startDate: new Date("2024-10-16T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-20T00:00:00Z").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-19T00:00:00Z"),
        endDate: DateVo.create("2024-10-21T00:00:00Z"),
      });

      const availableDresses =
        await repository.getAllAvailableForPeriod(period);
      expect(availableDresses).toHaveLength(0);
    });

    it("should return no dresses available for the given period when the reservation starts before the requested period and ends after the requested period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10").toISOString(),
            endDate: new Date("2024-10-15").toISOString(),
          },
        ],
      });
      await repository.save(dress);
      const period = new Period({
        startDate: DateVo.create("2024-10-09"),
        endDate: DateVo.create("2024-10-20"),
      });
      const availableDresses =
        await repository.getAllAvailableForPeriod(period);
      expect(availableDresses).toHaveLength(0);
    });
  });

  describe("getAllNotAvailableForPeriod", () => {
    it("should return an empty array when no reservation periods are set", async () => {
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

      const period = new Period({
        startDate: DateVo.create("2024-10-01"),
        endDate: DateVo.create("2024-10-05"),
      });

      const unavailableDresses =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableDresses).toHaveLength(0);
    });

    it("should return an empty array when the requested period is before any reservation period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10").toISOString(),
            endDate: new Date("2024-10-15").toISOString(),
          },
          {
            startDate: new Date("2024-10-16").toISOString(),
            endDate: new Date("2024-10-20").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-07"),
        endDate: DateVo.create("2024-10-09"),
      });

      const unavailableDresses =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableDresses).toHaveLength(0);
    });

    it("should return the dresses as unavailable when the requested period overlaps with a reservation period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-10").toISOString(),
            endDate: new Date("2024-10-15").toISOString(),
          },
          {
            startDate: new Date("2024-10-16").toISOString(),
            endDate: new Date("2024-10-20").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-12"),
        endDate: DateVo.create("2024-10-18"),
      });

      const unavailableDresses =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableDresses).toHaveLength(1);
      expect(unavailableDresses[0].equals(dress)).toBe(true);
    });

    it("should return the dresses as unavailable when reservation starts before and ends within the requested period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-07").toISOString(),
            endDate: new Date("2024-10-09").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-08"),
        endDate: DateVo.create("2024-10-10"),
      });

      const unavailableDresses =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableDresses).toHaveLength(1);
      expect(unavailableDresses[0].equals(dress)).toBe(true);
    });

    it("should return the dresses as unavailable when reservation starts within and ends after the requested period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-09").toISOString(),
            endDate: new Date("2024-10-12").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-10"),
        endDate: DateVo.create("2024-10-11"),
      });

      const unavailableDresses =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableDresses).toHaveLength(1);
      expect(unavailableDresses[0].equals(dress)).toBe(true);
    });

    it("should return the dresses as unavailable when the requested period endDate is the same as the reservation startDate", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
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
          {
            startDate: new Date("2024-10-16T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-20T00:00:00Z").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-08T00:00:00Z"),
        endDate: DateVo.create("2024-10-10T00:00:00Z"),
      });

      const unavailableDresses =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableDresses).toHaveLength(1);
      expect(unavailableDresses[0].equals(dress)).toBe(true);
    });

    it("should return the dresses as unavailable when the requested period startDate is the same as the reservation endDate", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
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
          {
            startDate: new Date("2024-10-16T00:00:00Z").toISOString(),
            endDate: new Date("2024-10-20T00:00:00Z").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-15T00:00:00Z"),
        endDate: DateVo.create("2024-10-17T00:00:00Z"),
      });

      const unavailableDresses =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableDresses).toHaveLength(1);
      expect(unavailableDresses[0].equals(dress)).toBe(true);
    });

    it("should return the dresses as unavailable when reservation starts before and ends after the requested period", async () => {
      const dress = Dress.create({
        id: uuidv4(),
        imagePath: "https://example.com/dress.png",
        model: "Evening Dress",
        color: "Red",
        fabric: "Silk",
        rentPrice: 200.0,
        isPickedUp: false,
        reservationPeriods: [
          {
            startDate: new Date("2024-10-09").toISOString(),
            endDate: new Date("2024-10-21").toISOString(),
          },
        ],
      });

      await repository.save(dress);

      const period = new Period({
        startDate: DateVo.create("2024-10-10"),
        endDate: DateVo.create("2024-10-20"),
      });

      const unavailableDresses =
        await repository.getAllNotAvailableForPeriod(period);
      expect(unavailableDresses).toHaveLength(1);
      expect(unavailableDresses[0].equals(dress)).toBe(true);
    });
  });

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
        DressId.random(),
      ]);
      expect(result.exists).toContainEqual(dress.getId());
      expect(result.notExists).toHaveLength(1);
    });
  });

  describe("search", () => {
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
});
