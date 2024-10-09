import { DressFilter, DressSearchParams } from "./dress.repository";

describe("DressSearchParams", () => {
  describe("create", () => {
    it("should create a new instance with default values", () => {
      const searchParams = DressSearchParams.create();

      expect(searchParams).toBeInstanceOf(DressSearchParams);
      expect(searchParams.filter).toBeNull();
      expect(searchParams.page).toBe(1);
      expect(searchParams.perPage).toBe(15);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.sortDir).toBeNull();
    });

    it("should create a new instance with provided filter values", () => {
      const filter: DressFilter = {
        color: "Red",
        model: "Evening Gown",
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
        rentPrice: 0,
      };
      const searchParams = DressSearchParams.create({
        filter,
      });

      expect(searchParams).toBeInstanceOf(DressSearchParams);
      expect(searchParams.filter).toBeNull();
    });
  });
});
