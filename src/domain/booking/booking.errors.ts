export class InvalidBookingPeriodError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBookingPeriodError";
  }
}

export class BookingAlreadyPaidError extends Error {
  constructor() {
    super("Reserva já paga");
    this.name = "BookingAlreadyPaidError";
  }
}
