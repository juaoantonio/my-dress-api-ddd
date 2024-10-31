import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from "typeorm";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";

@Entity({ name: "clutch_booking_item" })
export class BookingItemClutchModel {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "float" })
  rentPrice: number;

  @Column({ type: "boolean" })
  isCourtesy: boolean;

  @Column()
  clutchId: string;

  @ManyToOne(() => ClutchModel, (clutch) => clutch.id, { eager: true })
  @JoinColumn({
    name: "clutchId",
    referencedColumnName: "id",
  })
  clutch: Relation<ClutchModel>;

  @Column()
  bookingId: string;

  @ManyToOne(() => BookingModel, (booking) => booking.clutches)
  @JoinColumn({
    name: "bookingId",
    referencedColumnName: "id",
  })
  booking: Relation<BookingModel>;
}
