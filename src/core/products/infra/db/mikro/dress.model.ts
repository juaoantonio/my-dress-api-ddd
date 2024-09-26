import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";

@Entity()
export class DressModel {
  @PrimaryKey({ type: "uuid" })
  id!: string;

  @Property()
  imageUrl!: string;

  @Property({ type: "double precision" })
  rentPrice!: number;

  @Property()
  color!: string;

  @Property()
  model!: string;

  @Property()
  fabric!: string;

  @Property()
  isPickedUp!: boolean;

  @OneToMany(
    () => ReservationPeriodModel,
    (reservationPeriod) => reservationPeriod.dress,
  )
  reservationPeriods = new Array<ReservationPeriodModel>();

  constructor(id: string) {
    this.id = id;
  }
}

@Entity()
export class ReservationPeriodModel {
  @PrimaryKey({ type: "uuid" })
  id!: string;

  @Property()
  startDate!: Date;

  @Property()
  endDate!: Date;

  @ManyToOne()
  dress!: DressModel;
}
