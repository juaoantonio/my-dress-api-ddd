import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { AppointmentStatus } from "@core/appointment/domain/appointment.aggregate";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";

@Entity({ name: "appointments_history" })
export class AppointmentHistoryModel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => AppointmentModel, (appointment) => appointment.history)
  appointment: Relation<AppointmentModel>;

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

  @Column({
    type: "text",
    transformer: {
      to: (value: Date) => value.toISOString(),
      from: (value: string) => new Date(value),
    },
  })
  date: Date;
}
