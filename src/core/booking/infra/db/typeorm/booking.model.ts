import { Column, Entity, OneToMany, Relation } from "typeorm";
import { BookingStatus } from "@core/booking/domain/booking.aggregate-root";
import { BookingItemDressModel } from "./booking-item-dress.model";
import { BaseModel } from "@core/@shared/infra/db/typeorm/base.model";
import { BookingItemClutchModel } from "@core/booking/infra/db/typeorm/booking-item-clutch.model";

@Entity({ name: "bookings" })
export class BookingModel extends BaseModel {
  @Column()
  customerName: string;

  @Column({
    type: "text",
    transformer: {
      to: (value: Date) => value.toISOString(),
      from: (value: string) => new Date(value),
    },
  })
  eventDate: Date;

  @Column({
    type: "text",
    transformer: {
      to: (value: Date) => value.toISOString(),
      from: (value: string) => new Date(value),
    },
  })
  expectedPickUpDate: Date;

  @Column({
    type: "text",
    transformer: {
      to: (value: Date) => value.toISOString(),
      from: (value: string) => new Date(value),
    },
  })
  expectedReturnDate: Date;

  @Column({
    type: "text",
    nullable: true,
    transformer: {
      to: (value: Date) => (value ? value.toISOString() : null),
      from: (value: string) => (value ? new Date(value) : null),
    },
  })
  pickUpDate: Date;

  @Column({
    type: "text",
    nullable: true,
    transformer: {
      to: (value: Date) => (value ? value.toISOString() : null),
      from: (value: string) => (value ? new Date(value) : null),
    },
  })
  returnDate: Date;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    transformer: {
      to: (value: BookingStatus) => value,
      from: (value: string) =>
        BookingStatus[value as keyof typeof BookingStatus],
    },
  })
  status: BookingStatus;

  @Column({ type: "float" })
  amountPaid: number;

  @OneToMany(() => BookingItemDressModel, (item) => item.booking, {
    eager: true,
    cascade: true,
  })
  dresses: Relation<BookingItemDressModel>[];

  @OneToMany(() => BookingItemClutchModel, (item) => item.booking, {
    eager: true,
    cascade: true,
  })
  clutches: Relation<BookingItemClutchModel>[];
}
