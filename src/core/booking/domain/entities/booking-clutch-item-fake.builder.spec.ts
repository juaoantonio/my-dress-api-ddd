import { BookingClutchItem } from "@core/booking/domain/entities/booking-clutch-item.entity";
import { BookingClutchItemFakeBuilder } from "@core/booking/domain/entities/booking-clutch-item-fake.builder";

describe("BookingClutchItemFakeBuilder", () => {
  it("should create a single BookingClutchItem with default values", () => {
    const clutchItem = BookingClutchItemFakeBuilder.aClutchItem().build();
    expect(clutchItem).toBeInstanceOf(BookingClutchItem);
    expect(clutchItem.getRentPrice()).toBeGreaterThan(0);
  });

  it("should create multiple BookingClutchItems", () => {
    const clutchItems = BookingClutchItemFakeBuilder.theClutchItems(3).build();
    expect(clutchItems).toHaveLength(3);
    clutchItems.forEach((item) => {
      expect(item).toBeInstanceOf(BookingClutchItem);
    });
  });

  it("should allow customization of rent price", () => {
    const clutchItem = BookingClutchItemFakeBuilder.aClutchItem()
      .withRentPrice(200)
      .build();
    expect(clutchItem.getRentPrice()).toBe(200);
  });

  it("should allow customization of isCourtesy", () => {
    const clutchItem = BookingClutchItemFakeBuilder.aClutchItem()
      .withIsCourtesy(true)
      .build();
    expect(clutchItem.getIsCourtesy()).toBe(true);
  });
});
