import { describe, expect, it } from "vitest";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import {
  ClutchOutput,
  ClutchOutputMapper,
} from "@core/products/application/clutch/common/clutch.output-mapper";

describe("ClutchOutputMapper", () => {
  describe("toOutput", () => {
    it("deve mapear corretamente um objeto Clutch para ClutchOutput", () => {
      // Arrange: Criação de uma instância de Clutch com valores conhecidos
      const clutch = Clutch.create({
        id: "123e4567-e89b-12d3-a456-426614174000",
        rentPrice: 150,
        color: "Black",
        model: "Model X",
        isPickedUp: false,
        imagePath: "images/elegant-clutch.jpg",
      });
      const output: ClutchOutput = ClutchOutputMapper.toOutput(clutch);
      expect(output).toStrictEqual({
        id: "123e4567-e89b-12d3-a456-426614174000",
        rentPrice: 150,
        name: "Black Model X",
        color: "Black",
        model: "Model X",
        isPickedUp: false,
        imagePath: "images/elegant-clutch.jpg",
        type: "clutch",
      });
    });

    it("deve lançar um erro se clutch for undefined", () => {
      const clutch = undefined as unknown as Clutch;
      expect(() => ClutchOutputMapper.toOutput(clutch)).toThrow();
    });

    it("deve lançar um erro se clutch for null", () => {
      const clutch = null as unknown as Clutch;
      expect(() => ClutchOutputMapper.toOutput(clutch)).toThrow();
    });
  });

  describe("toOutputMany", () => {
    it("deve mapear corretamente uma lista de Clutches para ClutchOutputs", () => {
      const clutch1 = Clutch.create({
        id: "123e4567-e89b-12d3-a456-426614174000",
        rentPrice: 150,
        color: "Black",
        model: "Model X",
        isPickedUp: false,
        imagePath: "images/elegant-clutch.jpg",
      });
      const clutch2 = Clutch.create({
        id: "123e4567-e89b-12d3-a456-426614174001",
        rentPrice: 200,
        color: "Red",
        model: "Model Y",
        isPickedUp: true,
        imagePath: "images/stylish-clutch.jpg",
      });
      const clutches = [clutch1, clutch2];
      const outputs: ClutchOutput[] = ClutchOutputMapper.toOutputMany(clutches);
      expect(outputs).toStrictEqual([
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          rentPrice: 150,
          name: "Black Model X",
          color: "Black",
          model: "Model X",
          isPickedUp: false,
          imagePath: "images/elegant-clutch.jpg",
          type: "clutch",
        },
        {
          id: "123e4567-e89b-12d3-a456-426614174001",
          rentPrice: 200,
          name: "Red Model Y",
          color: "Red",
          model: "Model Y",
          isPickedUp: true,
          imagePath: "images/stylish-clutch.jpg",
          type: "clutch",
        },
      ]);
    });

    it("deve retornar uma lista vazia se clutches for uma lista vazia", () => {
      const clutches: Clutch[] = [];
      const outputs: ClutchOutput[] = ClutchOutputMapper.toOutputMany(clutches);
      expect(outputs).toStrictEqual([]);
    });

    it("deve lançar um erro se clutches for undefined", () => {
      const clutches = undefined as unknown as Clutch[];
      expect(() => ClutchOutputMapper.toOutputMany(clutches)).toThrow();
    });

    it("deve lançar um erro se clutches for null", () => {
      const clutches = null as unknown as Clutch[];
      expect(() => ClutchOutputMapper.toOutputMany(clutches)).toThrow();
    });
  });
});
