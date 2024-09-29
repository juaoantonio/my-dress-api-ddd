import { Uuid } from "../../@shared/domain/value-objects/uuid.vo";
import { AggregateRoot } from "../../@shared/domain/aggregate-root";
import { BookingId } from "../../booking/domain/booking.aggregate";
import { DateVo } from "../../@shared/domain/value-objects/date.vo";
import { AppointmentValidatorFactory } from "./appointment.validator";
import { ValueObject } from "../../@shared/domain/value-object";

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum AppointmentType {
  INITIAL_VISIT = "INITIAL_VISIT",
  RETURN_FOR_ADJUSTMENT = "RETURN_FOR_ADJUSTMENT",
  PICKUP = "PICKUP",
  RETURN = "RETURN",
}

export type AppointmentConstructorProps = {
  id: AppointmentId;
  bookingId?: BookingId; // O agendamento pode existir antes da criação de uma reserva
  appointmentDate: DateVo; // Data da visita à loja
  customerName: string; // Nome e Sobrenome da cliente
  eventDate: DateVo; // Data do evento
  type: AppointmentType;
  status?: AppointmentStatus;
};

export type AppointmentCreateProps = {
  appointmentDate: DateVo;
  customerName: string;
  eventDate: DateVo;
  type: AppointmentType;
  bookingId?: BookingId;
};

export class AppointmentId extends Uuid {}

export class Appointment extends AggregateRoot<AppointmentId> {
  private bookingId?: BookingId;
  private appointmentDate: DateVo;
  private history: AppointmentHistory[] = [];
  private customerName: string;
  private eventDate: DateVo;
  private type: AppointmentType;
  private status: AppointmentStatus;

  constructor(props: AppointmentConstructorProps) {
    super(props.id);
    this.bookingId = props.bookingId;
    this.appointmentDate = props.appointmentDate;
    this.customerName = props.customerName;
    this.eventDate = props.eventDate;
    this.type = props.type;
    this.status = props.status || AppointmentStatus.SCHEDULED;
  }

  static create(props: AppointmentCreateProps): Appointment {
    const id = AppointmentId.random();
    const appointment = new Appointment({
      id,
      appointmentDate: props.appointmentDate,
      customerName: props.customerName,
      eventDate: props.eventDate,
      type: props.type,
      bookingId: props.bookingId,
    });
    appointment.validate();
    return appointment;
  }

  validate(fields?: string[]): void {
    const validator = AppointmentValidatorFactory.create();
    validator.validate(this.notification, this, fields);
  }

  // Behavior methods
  public complete(): void {
    this.status = AppointmentStatus.COMPLETED;
  }

  public cancel(): void {
    if (this.status === AppointmentStatus.COMPLETED) {
      this.notification.addError(
        "Agendamento não pode ser cancelado pois já foi concluído",
      );
    }
    this.status = AppointmentStatus.CANCELLED;
  }

  public reschedule(newDate: DateVo): void {
    this.appointmentDate = newDate;
    if (this.status === AppointmentStatus.COMPLETED) {
      this.notification.addError(
        "Agendamento não pode ser reagendado pois já foi concluído",
      );
    }
    this.history.push(
      new AppointmentHistory({
        appointmentId: this.getId(),
        status: this.status,
        date: DateVo.now(),
      }),
    );
    this.validate(["appointmentDate"]);
  }

  // Getters
  public getAppointmentDate(): DateVo {
    return this.appointmentDate;
  }

  public getCustomerName(): string {
    return this.customerName;
  }

  public getEventDate(): DateVo {
    return this.eventDate;
  }

  public getStatus(): AppointmentStatus {
    return this.status;
  }

  public getType(): AppointmentType {
    return this.type;
  }

  public getBookingId(): BookingId | undefined {
    return this.bookingId;
  }

  public getHistory(): AppointmentHistory[] {
    return this.history;
  }
}

export class AppointmentHistory extends ValueObject {
  private readonly appointmentId: AppointmentId;
  private readonly status: AppointmentStatus;
  private readonly date: DateVo;

  constructor(props: {
    appointmentId: AppointmentId;
    status: AppointmentStatus;
    date: DateVo;
  }) {
    super();
    this.appointmentId = props.appointmentId;
    this.status = props.status;
    this.date = props.date;
  }

  public getAppointmentId(): AppointmentId {
    return this.appointmentId;
  }

  public getStatus(): AppointmentStatus {
    return this.status;
  }

  public getDate(): DateVo {
    return this.date;
  }
}
