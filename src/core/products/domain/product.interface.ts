import { DateVo } from "../../@shared/domain/vo/date.vo";
import { Period } from "../../@shared/domain/vo/period.vo";

export interface IProduct {
  getRentPrice(): number;
  pickUp(): void;
  return(): void;
  isAvailableFor(date: DateVo): boolean;
  getReservationPeriods(): Period[];
  addReservationPeriod(period: Period): void;
}
