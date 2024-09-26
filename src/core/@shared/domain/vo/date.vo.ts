import { ValueObject } from "../value-object";

export class DateVo extends ValueObject {
  private readonly date: Date;

  constructor(date: Date) {
    super();
    this.date = date;
  }

  static create(date: Date | string): DateVo {
    return new DateVo(new Date(date));
  }

  static now(): DateVo {
    return new DateVo(new Date());
  }

  public getDate(): Date {
    return this.date;
  }

  public getDateFormatted(): string {
    return this.date.toISOString().split("T")[0];
  }

  public isToday(): boolean {
    const today = new Date();
    return (
      this.date.getDate() === today.getDate() &&
      this.date.getMonth() === today.getMonth() &&
      this.date.getFullYear() === today.getFullYear()
    );
  }

  public isInPast(): boolean {
    return this.date < new Date();
  }

  public isInFuture(): boolean {
    return this.date > new Date();
  }
}
