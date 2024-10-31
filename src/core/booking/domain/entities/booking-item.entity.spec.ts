import {
  BookingDressItem,
  BookingDressItemId,
} from "./booking-dress-item.entity";
import { Adjustment } from "./vo/adjustment.vo";
import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";

describe("BookingItemEntity Unit Test", () => {
  describe("constructor", () => {
    it("should create a new booking item", () => {
      const bookingItem = new BookingDressItem({
        id: BookingDressItemId.random(),
        productId: Uuid.create("60151058-1563-4db3-9270-3c091dce3e82").value,
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [],
      });

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
      const bookingItem = BookingDressItem.create({
        productId: Uuid.random().value,
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [],
      });

      expect(bookingItem.getRentPrice()).toBe(100);
      expect(bookingItem.getAdjustments()).toEqual([]);
      expect(bookingItem.getIsCourtesy()).toBe(false);
      expect(bookingItem.notification.hasErrors()).toBe(false);
    });
  });

  describe("addAdjustment", () => {
    it("should add an adjustment to the booking item that is a dress", () => {
      const bookingItem = new BookingDressItem({
        id: BookingDressItemId.random(),
        productId: Uuid.random().value,
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
      const bookingItem = new BookingDressItem({
        id: BookingDressItemId.random(),
        productId: Uuid.random().value,
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
      const bookingItem = new BookingDressItem({
        id: BookingDressItemId.random(),
        productId: Uuid.random().value,
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
      const bookingItem = new BookingDressItem({
        id: BookingDressItemId.random(),
        productId: Uuid.random().value,
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
      const bookingItem = BookingDressItem.create({
        id: BookingDressItemId.random(),
        productId: "",
        isCourtesy: false,
        rentPrice: 100,
        adjustments: [],
      });

      expect(bookingItem.notification.hasErrors()).toBe(true);
      expect(bookingItem.notification).notificationContainsErrorMessages([
        { productId: ["Id do produto inválido"] },
      ]);
    });
  });
});
