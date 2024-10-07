import { BookingItem, BookingItemId } from "./booking-item.entity";
import { Adjustment } from "./vo/adjustment.vo";
import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";

describe("BookingItemEntity Unit Test", () => {
  describe("constructor", () => {
    it("should create a new booking item", () => {
      const bookingItem = new BookingItem({
        id: BookingItemId.random(),
        productId: Uuid.create("60151058-1563-4db3-9270-3c091dce3e82").value,
        type: "dress",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [],
      });

      expect(bookingItem.getType()).toBe("dress");
      expect(bookingItem.getRentPrice()).toBe(100);
      expect(bookingItem.getAdjustments()).toEqual([]);
      expect(bookingItem.getProductId()).toBe(
        "60151058-1563-4db3-9270-3c091dce3e82",
      );
      expect(bookingItem.getIsCourtesy()).toBe(false);
    });
  });

  describe("Create method", () => {
    it("should create a new booking item", () => {
      const bookingItem = BookingItem.create({
        productId: Uuid.random().value,
        type: "dress",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [],
      });

      expect(bookingItem.getType()).toBe("dress");
      expect(bookingItem.getRentPrice()).toBe(100);
      expect(bookingItem.getAdjustments()).toEqual([]);
      expect(bookingItem.getIsCourtesy()).toBe(false);
      expect(bookingItem.notification.hasErrors()).toBe(false);
    });

    it("should validate when a booking item that is not a dress is created with adjustments", () => {
      const bookingItem = BookingItem.create({
        id: BookingItemId.random(),
        productId: Uuid.random().value,
        type: "clutch",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [
          new Adjustment("Cintura", "3cm"),
          new Adjustment("Tronco", "2cm"),
        ],
      });

      expect(bookingItem.notification.hasErrors()).toBe(true);
      expect(bookingItem.notification).notificationContainsErrorMessages([
        { adjustments: ["Somente vestidos podem ter ajustes"] },
      ]);
    });
  });

  describe("addAdjustment", () => {
    it("should add an adjustment to the booking item that is a dress", () => {
      const bookingItem = new BookingItem({
        id: BookingItemId.random(),
        productId: Uuid.random().value,
        type: "dress",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [],
      });

      bookingItem.addAdjustment({
        label: "Tronco",
        description: "2cm",
      });

      expect(bookingItem.getAdjustments()).toEqual([
        { label: "Tronco", description: "2cm" },
      ]);
    });

    it("should add multiple adjustments to the booking item", () => {
      const bookingItem = new BookingItem({
        id: BookingItemId.random(),
        productId: Uuid.random().value,
        type: "dress",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [],
      });

      bookingItem.addManyAdjustments([
        { label: "Tronco", description: "2cm" },
        { label: "Cintura", description: "3cm" },
      ]);

      expect(bookingItem.getAdjustments()).toEqual([
        { label: "Tronco", description: "2cm" },
        { label: "Cintura", description: "3cm" },
      ]);
    });

    it("should remove an adjustment from the booking item", () => {
      const bookingItem = new BookingItem({
        id: BookingItemId.random(),
        productId: Uuid.random().value,
        type: "dress",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [
          new Adjustment("Cintura", "3cm"),
          new Adjustment("Tronco", "2cm"),
        ],
      });

      bookingItem.removeAdjustment({
        label: "Tronco",
        description: "2cm",
      });

      expect(bookingItem.getAdjustments()).toEqual([
        { label: "Cintura", description: "3cm" },
      ]);
    });

    it("should clear all adjustments from the booking item", () => {
      const bookingItem = new BookingItem({
        id: BookingItemId.random(),
        productId: Uuid.random().value,
        type: "dress",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [
          new Adjustment("Cintura", "3cm"),
          new Adjustment("Tronco", "2cm"),
        ],
      });

      bookingItem.clearAdjustments();

      expect(bookingItem.getAdjustments()).toEqual([]);
    });

    it("should validate invalid fields", () => {
      const bookingItem = BookingItem.create({
        id: BookingItemId.random(),
        productId: "",
        type: "dress",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [],
      });

      expect(bookingItem.notification.hasErrors()).toBe(true);
      expect(bookingItem.notification).notificationContainsErrorMessages([
        { productId: ["Id do produto inválido"] },
      ]);
    });

    it("should validate when try to add adjustments to a clutch", () => {
      const bookingItem = BookingItem.create({
        id: BookingItemId.random(),
        productId: Uuid.random().value,
        type: "clutch",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [],
      });

      bookingItem.addAdjustment({
        label: "Tronco",
        description: "2cm",
      });

      expect(bookingItem.notification.hasErrors()).toBe(true);
      expect(bookingItem.notification).notificationContainsErrorMessages([
        { adjustments: ["Somente vestidos podem ter ajustes"] },
      ]);
    });

    it("should validate when try to add many adjustments to a clutch", () => {
      const bookingItem = BookingItem.create({
        id: BookingItemId.random(),
        productId: Uuid.random().value,
        type: "clutch",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [],
      });

      bookingItem.addManyAdjustments([
        { label: "Tronco", description: "2cm" },
        { label: "Cintura", description: "3cm" },
      ]);

      expect(bookingItem.notification.hasErrors()).toBe(true);
      expect(bookingItem.notification).notificationContainsErrorMessages([
        { adjustments: ["Somente vestidos podem ter ajustes"] },
      ]);
    });
  });
});
