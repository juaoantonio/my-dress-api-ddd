import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AppointmentStatus } from "@core/appointment/domain/appointment.aggregate";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";

@Entity()
export class AppointmentHistoryModel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => AppointmentModel, (appointment) => appointment.history)
  appointment: AppointmentModel;

  @Column({
    type: "text",
    enum: AppointmentStatus,
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
