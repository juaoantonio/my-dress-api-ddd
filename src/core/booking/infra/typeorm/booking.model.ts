import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BookingItemModel } from "@core/booking/infra/typeorm/booking-item.model";
import { BookingStatus } from "@core/booking/domain/booking.aggregate-root";

@Entity({ name: "bookings" })
export class BookingModel {
  @PrimaryColumn({ type: "uuid" })
  id: string;

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
  items: BookingItemModel[];
}
