import { BookingDressItem } from "@core/booking/domain/entities/booking-dress-item.entity";
import { BookingDressItemFakeBuilder } from "@core/booking/domain/entities/booking-dress-item-fake.builder";
import { Adjustment } from "@core/booking/domain/entities/vo/adjustment.vo";

describe("BookingDressItemFakeBuilder", () => {
  it("should create a single BookingDressItem with default values", () => {
    const dressItem = BookingDressItemFakeBuilder.aDressItem().build();
    expect(dressItem).toBeInstanceOf(BookingDressItem);
    expect(dressItem.getRentPrice()).toBeGreaterThan(0);
  });

  it("should create multiple BookingDressItems", () => {
    const dressItems = BookingDressItemFakeBuilder.theDressItems(3).build();
    expect(dressItems).toHaveLength(3);
    dressItems.forEach((item) => {
      expect(item).toBeInstanceOf(BookingDressItem);
    });
  });

  it("should allow customization of rent price", () => {
    const dressItem = BookingDressItemFakeBuilder.aDressItem()
      .withRentPrice(500)
      .build();
    expect(dressItem.getRentPrice()).toBe(500);
  });

  it("should allow customization of isCourtesy", () => {
    const dressItem = BookingDressItemFakeBuilder.aDressItem()
      .withIsCourtesy(true)
      .build();
    expect(dressItem.getIsCourtesy()).toBe(true);
  });

  it("should allow adding custom adjustments", () => {
    const adjustments = [new Adjustment("Hem", "Shortened hem")];
    const dressItem = BookingDressItemFakeBuilder.aDressItem()
      .withAdjustments(adjustments)
      .build();
    expect(dressItem.getAdjustments()).toEqual(adjustments);
  });
});
