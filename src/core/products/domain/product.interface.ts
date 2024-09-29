import { DateVo } from "../../@shared/domain/value-objects/date.vo";
import { Period } from "../../@shared/domain/value-objects/period.vo";

export interface IProduct {
  getRentPrice(): number;

  pickUp(): void;

  return(): void;

  isAvailableFor(date: DateVo): boolean;

  getReservationPeriods(): Period[];

  addReservationPeriod(period: Period): void;
}
