import { Column, OneToMany } from "typeorm";
import { ProductType } from "@core/products/domain/product";
import { BaseModel } from "@core/@shared/infra/db/typeorm/base.model";
import { BookingItemModel } from "@core/booking/infra/db/typeorm/booking-item.model";

export class ProductModel extends BaseModel {
  @Column("text")
  imageUrl: string;

  @Column("float")
  rentPrice: number;

  @Column("varchar")
  color: string;

  @Column("varchar")
  model: string;

  @Column("boolean")
  isPickedUp: boolean;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    transformer: {
      to: (value: ProductType) => value,
      from: (value: string) => ProductType[value as keyof typeof ProductType],
    },
  })
  type: ProductType;

  @OneToMany(() => BookingItemModel, (bookingItem) => bookingItem.product, {
    eager: true,
  })
  bookingItems: BookingItemModel[];
}
