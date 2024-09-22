import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateVo } from "@domain/@shared/vo/date.vo";

describe("DateVO", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-08-30T00:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("constructor", () => {
    it("should create a new instance of DateVO", () => {
      // Arrange
      const date = new Date();
      // Act
      const dateVO = new DateVo(date);
      // Assert
      expect(dateVO).toBeDefined();
      expect(dateVO.getDate()).toBe(date);
      expect(dateVO.getDateFormatted()).toBe("2024-08-30");
    });
  });

  describe("create", () => {
    it("should create a new instance of DateVO from a string", () => {
      // Arrange
      const date = "2024-08-30";
      // Act
      const dateVO = DateVo.create(date);
      // Assert
      expect(dateVO).toBeDefined();
      expect(dateVO.getDate()).toEqual(new Date(date));
      expect(dateVO.getDateFormatted()).toBe("2024-08-30");
    });
  });
});
