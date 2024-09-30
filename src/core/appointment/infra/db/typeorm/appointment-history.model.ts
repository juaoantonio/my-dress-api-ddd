import { Column, ManyToOne, PrimaryColumn } from "typeorm";
import { AppointmentStatus } from "@core/appointment/domain/appointment.aggregate";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";

export class AppointmentHistoryModel {
  @PrimaryColumn({
    type: "uuid",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @ManyToOne(() => AppointmentModel, (appointment) => appointment.history)
  appointment: AppointmentModel;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;

  @Column({
    type: "timestamptz",
  })
  date: Date;

  constructor(props: Omit<AppointmentHistoryModel, "id">) {
    this.appointment = props.appointment;
    this.status = props.status;
    this.date = props.date;
  }
}
