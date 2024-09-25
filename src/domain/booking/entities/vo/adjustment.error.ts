export class InvalidAdjustmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAdjustmentError";
  }
}
