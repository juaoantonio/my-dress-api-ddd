import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from "typeorm";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { ProductModel } from "@core/products/infra/db/typeorm/product.model";

@Entity({ name: "booking_items" })
export class BookingItemModel {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "varchar" })
  type: "dress" | "clutch";

  @Column({ type: "float" })
  rentPrice: number;

  @Column({ type: "json" })
  adjustments: { label: string; description: string }[];

  @Column({ type: "boolean" })
  isCourtesy: boolean;

  @ManyToOne(() => ProductModel, (product) => product.id, { eager: true })
  product: ProductModel;

  @ManyToOne(() => BookingModel, (booking) => booking.items)
  booking: Relation<BookingModel>;
}
