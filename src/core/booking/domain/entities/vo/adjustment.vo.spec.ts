import { expect, it } from "vitest";
import { Adjustment } from "./adjustment.vo";
import { InvalidAdjustmentError } from "./adjustment.error";

it("should create a new adjustment", () => {
  const adjustment = new Adjustment("Tronco", "2cm");

  expect(adjustment.label).toBe("Tronco");
  expect(adjustment.description).toBe("2cm");
});

it("should throw an error if label is empty", () => {
  expect(() => new Adjustment("", "2cm")).toThrowError(
    new InvalidAdjustmentError(
      "Rótulo do ajuste deve ter no mínimo 1 caractere",
    ),
  );
});

it("should throw an error if description is empty", () => {
  expect(() => new Adjustment("Tronco", "")).toThrowError(
    new InvalidAdjustmentError(
      "Descrição do ajuste deve ter no mínimo 1 caractere",
    ),
  );
});
