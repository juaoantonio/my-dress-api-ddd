import { Column, Entity, OneToMany } from "typeorm";
import { BaseModel } from "@core/@shared/infra/db/typeorm/base.model";
import { ProductType } from "@core/products/domain/product";
import { BookingItemDressModel } from "@core/booking/infra/db/typeorm/booking-item-dress.model";

@Entity("clutches")
export class ClutchModel extends BaseModel {
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

  @OneToMany(() => BookingItemDressModel, (bookingItem) => bookingItem.dress)
  bookingItems: BookingItemDressModel[];
}
