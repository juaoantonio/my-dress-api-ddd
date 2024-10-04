import { ValueObject } from "../value-object";
import { DateVo } from "./date.vo";

export class Period extends ValueObject {
  private readonly startDate: DateVo;
  private readonly endDate: DateVo;

  constructor(props: { startDate: DateVo; endDate: DateVo }) {
    super();

    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }

  static create(props: { startDate: DateVo; endDate: DateVo }): Period {
    const period = new Period(props);
    period.validate();
    return period;
  }

  validate(): void {
    if (this.startDate.getValue() < new Date()) {
      throw new Error("Start date cannot be in the past");
    }

    if (this.endDate.getValue() < new Date()) {
      throw new Error("End date cannot be in the past");
    }

    if (this.startDate.getValue() > this.endDate.getValue()) {
      throw new Error("Start date cannot be after end date");
    }
  }

  public getStartDate(): DateVo {
    return this.startDate;
  }

  public getEndDate(): DateVo {
    return this.endDate;
  }

  public getTotalDays(): number {
    const diffTime = Math.abs(
      this.endDate.getValue().getTime() - this.startDate.getValue().getTime(),
    );
    const milisecondsInADay = 1000 * 60 * 60 * 24;
    const diffDays = Math.ceil(diffTime / milisecondsInADay);
    return diffDays + 1;
  }

  public contains(date: DateVo): boolean {
    return (
      date.getValue() >= this.startDate.getValue() &&
      date.getValue() <= this.endDate.getValue()
    );
  }
}
