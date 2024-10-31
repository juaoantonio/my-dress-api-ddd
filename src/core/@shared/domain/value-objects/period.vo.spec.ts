import { Period } from "./period.vo";
import { DateVo } from "./date.vo";

describe("Period Value Object Unit Tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-09-20"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create a valid period", () => {
    const startDate = DateVo.create("2024-09-20");
    const endDate = DateVo.create("2024-09-25");

    const period = Period.create({ startDate, endDate });

    expect(period.getStartDate()).toEqual(startDate);
    expect(period.getEndDate()).toEqual(endDate);
    expect(period.getTotalDays()).toBe(6); // Deve incluir ambos os dias
  });

  it("should throw error if start date is after end date", () => {
    const startDate = DateVo.create("2024-09-25");
    const endDate = DateVo.create("2024-09-20");

    expect(() => {
      Period.create({ startDate, endDate });
    }).toThrow(
      "Parâmetros inválidos: startDate: Data de início não pode ser maior que a data de término. endDate: Data de término não pode ser menor que a data de início.",
    );
  });

  it("should correctly calculate the number of days in the period", () => {
    const startDate = DateVo.create("2024-09-20");
    const endDate = DateVo.create("2024-09-22");

    const period = Period.create({ startDate, endDate });

    expect(period.getTotalDays()).toBe(3);
  });

  it("should correctly check if a date is contained in the period", () => {
    const startDate = DateVo.create("2024-09-20");
    const endDate = DateVo.create("2024-09-25");

    const period = Period.create({ startDate, endDate });

    const dateInside = DateVo.create("2024-09-22");
    const dateOutside = DateVo.create("2024-09-26");

    expect(period.contains(dateInside)).toBe(true);
    expect(period.contains(dateOutside)).toBe(false);
  });

  it("should overlap with another period that its end date and start date are inside the first period", () => {
    const startDate = DateVo.create("2024-09-20");
    const endDate = DateVo.create("2024-09-25");

    const period = Period.create({ startDate, endDate });

    const overlappingPeriod = Period.create({
      startDate: DateVo.create("2024-09-22"),
      endDate: DateVo.create("2024-09-23"),
    });

    expect(period.overlaps(overlappingPeriod)).toBe(true);
  });

  it("should overlap with another period that its start date is before the first period", () => {
    const startDate = DateVo.create("2024-09-20");
    const endDate = DateVo.create("2024-09-25");

    const period = Period.create({ startDate, endDate });

    const overlappingPeriod = Period.create({
      startDate: DateVo.create("2024-09-18"),
      endDate: DateVo.create("2024-09-23"),
    });

    expect(period.overlaps(overlappingPeriod)).toBe(true);
  });

  it("should overlap with another period that its end date is after the first period", () => {
    const startDate = DateVo.create("2024-09-20");
    const endDate = DateVo.create("2024-09-25");

    const period = Period.create({ startDate, endDate });

    const overlappingPeriod = Period.create({
      startDate: DateVo.create("2024-09-22"),
      endDate: DateVo.create("2024-09-27"),
    });

    expect(period.overlaps(overlappingPeriod)).toBe(true);
  });

  it("should overlap with another period that its start date and end date are outside the first period", () => {
    const startDate = DateVo.create("2024-09-20");
    const endDate = DateVo.create("2024-09-25");

    const period = Period.create({ startDate, endDate });

    const overlappingPeriod = Period.create({
      startDate: DateVo.create("2024-09-18"),
      endDate: DateVo.create("2024-09-27"),
    });

    expect(period.overlaps(overlappingPeriod)).toBe(true);
  });

  it("should overlap with another period that its start date and end date are the same as the first period", () => {
    const startDate = DateVo.create("2024-09-20");
    const endDate = DateVo.create("2024-09-25");

    const period = Period.create({ startDate, endDate });

    const overlappingPeriod = Period.create({
      startDate: DateVo.create("2024-09-20"),
      endDate: DateVo.create("2024-09-25"),
    });

    expect(period.overlaps(overlappingPeriod)).toBe(true);
  });

  it("should not overlap with another period that its start date and end date are after the first period", () => {
    const startDate = DateVo.create("2024-09-20");
    const endDate = DateVo.create("2024-09-25");

    const period = Period.create({ startDate, endDate });

    const overlappingPeriod = Period.create({
      startDate: DateVo.create("2024-09-26"),
      endDate: DateVo.create("2024-09-27"),
    });

    expect(period.overlaps(overlappingPeriod)).toBe(false);
  });

  it("should not overlap with another period that its start date and end date are before the first period", () => {
    const startDate = DateVo.create("2024-09-20");
    const endDate = DateVo.create("2024-09-25");

    const period = Period.create({ startDate, endDate });

    const overlappingPeriod = Period.create({
      startDate: DateVo.create("2024-09-15"),
      endDate: DateVo.create("2024-09-19"),
    });

    expect(period.overlaps(overlappingPeriod)).toBe(false);
  });
});
