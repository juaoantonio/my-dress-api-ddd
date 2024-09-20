export class InvalidBookingPeriodError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBookingPeriodError";
  }
}
