import { ValueObject } from "@domain/@shared/value-object";

export class DateVo extends ValueObject {
  private readonly date: Date;

  constructor(date: Date) {
    super();
    this.date = date;
  }

  static create(date: Date | string): DateVo {
    return new DateVo(new Date(date));
  }

  public getDate(): Date {
    return this.date;
  }

  public getDateFormatted(): string {
    return this.date.toISOString().split("T")[0];
  }
}
