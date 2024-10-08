import { Column, PrimaryColumn } from "typeorm";
import { ProductType } from "@core/products/domain/product";

export class ProductModel {
  @PrimaryColumn("uuid")
  id: string;

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

  @Column("json")
  reservationPeriods: { startDate: string; endDate: string }[];

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
}
