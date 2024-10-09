import { Column, Entity, OneToMany, Relation } from "typeorm";
import { BookingStatus } from "@core/booking/domain/booking.aggregate-root";
import { BookingItemModel } from "./booking-item.model";
import { BaseModel } from "@core/@shared/infra/db/typeorm/base.model";

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
      to: (value: Date) => value.toISOString(),
      from: (value: string) => new Date(value),
    },
  })
  pickUpDate: Date;

  @Column({
    type: "text",
    nullable: true,
    transformer: {
      to: (value: Date) => value.toISOString(),
      from: (value: string) => new Date(value),
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

  @OneToMany(() => BookingItemModel, (item) => item.booking, {
    eager: true,
    cascade: true,
  })
  items: Relation<BookingItemModel>[];
}
