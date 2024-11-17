import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from "typeorm";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";

@Entity({ name: "dress_booking_item" })
export class BookingItemDressModel {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "float" })
  rentPrice: number;

  @Column({ type: "json" })
  adjustments: { label: string; description: string }[];

  @Column({ type: "boolean" })
  isCourtesy: boolean;

  @Column()
  dressId: string;

  @ManyToOne(() => DressModel, (product) => product.id, { eager: true })
  @JoinColumn({
    name: "dressId",
    referencedColumnName: "id",
  })
  dress: Relation<DressModel>;

  @ManyToOne(() => BookingModel, (booking) => booking.dresses, {
    orphanedRowAction: "delete",
  })
  @JoinColumn({
    name: "bookingId",
    referencedColumnName: "id",
  })
  booking: Relation<BookingModel>;

  @Column()
  bookingId: string;
}
