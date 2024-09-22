import { DateVo } from "@domain/@shared/vo/date.vo";
import { Period } from "@domain/@shared/vo/period.vo";

export interface IProduct {
  getRentPrice(): number;
  pickUp(): void;
  return(): void;
  isAvailableFor(date: DateVo): boolean;
  getReservationPeriods(): Period[];
  addReservationPeriod(period: Period): void;
}
