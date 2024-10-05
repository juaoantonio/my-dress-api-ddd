import { Column, Entity, OneToMany, PrimaryColumn, Relation } from "typeorm";
import {
  AppointmentStatus,
  AppointmentType,
} from "@core/appointment/domain/appointment.aggregate";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";

@Entity()
export class AppointmentModel {
  @PrimaryColumn({
    type: "uuid",
  })
  id: string;

  @Column({
    type: "uuid",
    nullable: true,
  })
  bookingId: string;

  @Column({
    type: "text",
    transformer: {
      to: (value: Date) => value.toISOString(),
      from: (value: string) => new Date(value),
    },
  })
  appointmentDate: Date;

  @Column({
    type: "varchar",
  })
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
    type: "varchar",
    length: 50,
    nullable: false,
    transformer: {
      to: (value: AppointmentType) => value,
      from: (value: string) =>
        AppointmentType[value as keyof typeof AppointmentType],
    },
  })
  type: AppointmentType;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    transformer: {
      to: (value: AppointmentStatus) => value,
      from: (value: string) =>
        AppointmentStatus[value as keyof typeof AppointmentStatus],
    },
  })
  status: AppointmentStatus;

  @OneToMany(() => AppointmentHistoryModel, (history) => history.appointment, {
    eager: true,
    cascade: true,
  })
  history: Relation<AppointmentHistoryModel>[];

  constructor(
    props: Omit<AppointmentModel, "history"> & {
      history?: AppointmentHistoryModel[];
    },
  ) {
    if (!props) return;
    this.id = props.id;
    this.bookingId = props.bookingId;
    this.appointmentDate = props.appointmentDate;
    this.customerName = props.customerName;
    this.eventDate = props.eventDate;
    this.type = props.type;
    this.status = props.status;
    this.history = props.history || [];
  }
}
