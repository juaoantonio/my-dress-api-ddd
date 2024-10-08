import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from "typeorm";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";

@Entity({ name: "booking_items" })
export class BookingItemModel {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  productId: string;

  @Column({ type: "varchar" })
  type: "dress" | "clutch";

  @Column({ type: "float" })
  rentPrice: number;

  @Column({ type: "json" })
  adjustments: { label: string; description: string }[];

  @Column({ type: "boolean" })
  isCourtesy: boolean;

  @ManyToOne(() => BookingModel, (booking) => booking.items)
  booking: Relation<BookingModel>;
}
