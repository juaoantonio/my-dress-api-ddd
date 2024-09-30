import { Column, OneToMany, PrimaryColumn } from "typeorm";
import {
  AppointmentStatus,
  AppointmentType,
} from "@core/appointment/domain/appointment.aggregate";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";

export class AppointmentModel {
  @PrimaryColumn({
    type: "uuid",
  })
  id: string;

  @Column({
    type: "uuid",
    nullable: true,
  })
  bookingId?: string;

  @Column({
    type: "timestamptz",
  })
  appointmentDate: Date;

  @Column({
    type: "varchar",
  })
  customerName: string;

  @Column({
    type: "timestamptz",
  })
  eventDate: Date;

  @Column({
    type: "enum",
    enum: AppointmentType,
  })
  type: AppointmentType;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;

  @OneToMany(() => AppointmentHistoryModel, (history) => history.appointment, {
    eager: true,
  })
  history: AppointmentHistoryModel[];

  constructor(props: Omit<AppointmentModel, "history">) {
    this.id = props.id;
    this.bookingId = props.bookingId;
    this.appointmentDate = props.appointmentDate;
    this.customerName = props.customerName;
    this.eventDate = props.eventDate;
    this.type = props.type;
    this.status = props.status;
  }
}
