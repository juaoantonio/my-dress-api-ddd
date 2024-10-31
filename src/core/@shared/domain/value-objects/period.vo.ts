import { ValueObject } from "../value-object";
import { DateVo } from "./date.vo";
import { InvalidVoFields } from "@core/@shared/domain/error/invalid-vo-params";

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
    if (this.startDate.getValue() > this.endDate.getValue()) {
      throw new InvalidVoFields([
        {
          startDate: [
            "Data de início não pode ser maior que a data de término",
          ],
          endDate: ["Data de término não pode ser menor que a data de início"],
        },
      ]);
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

  /**
   * Verifica se este período se sobrepõe a outro período.
   * Dois períodos se sobrepõem se um deles começa antes do término do outro e termina após o início do outro.
   * @param other Outro período para comparar.
   * @returns Retorna `true` se houver sobreposição, caso contrário, `false`.
   */
  public overlaps(other: Period): boolean {
    return (
      this.startDate.getValue() <= other.getEndDate().getValue() &&
      this.endDate.getValue() >= other.getStartDate().getValue()
    );
  }
}
