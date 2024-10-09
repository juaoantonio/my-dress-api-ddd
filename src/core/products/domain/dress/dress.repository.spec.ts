import { DressFilter, DressSearchParams } from "./dress.repository";

describe("DressSearchParams", () => {
  describe("create", () => {
    it("should create a new instance with default values", () => {
      const searchParams = DressSearchParams.create();

      expect(searchParams).toBeInstanceOf(DressSearchParams);
      expect(searchParams.filter).toBeNull();
      expect(searchParams.page).toBe(1);
      expect(searchParams.per_page).toBe(15);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.sort_dir).toBeNull();
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
        per_page: 10,
        sort: "model",
        sort_dir: "desc",
      });

      expect(searchParams).toBeInstanceOf(DressSearchParams);
      expect(searchParams.filter).toEqual({
        color: "Red",
        model: "Evening Gown",
        rentPrice: 100,
      });
      expect(searchParams.page).toBe(2);
      expect(searchParams.per_page).toBe(10);
      expect(searchParams.sort).toBe("model");
      expect(searchParams.sort_dir).toBe("desc");
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
