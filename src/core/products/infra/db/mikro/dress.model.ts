import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class DressModel {
  @PrimaryColumn({
    type: "uuid",
  })
  id: string;

  @Column()
  imageUrl: string;

  @Column()
  rentPrice: number;

  @Column()
  color: string;

  @Column()
  model: string;

  @Column()
  fabric: string;

  @Column()
  isPickedUp: boolean;

  @OneToMany(
    () => ReservationPeriodModel,
    (reservationPeriod) => reservationPeriod.dress,
  )
  reservationPeriods = new Array<ReservationPeriodModel>();

  constructor(props: {
    id: string;
    imageUrl: string;
    rentPrice: number;
    color: string;
    model: string;
    fabric: string;
    isPickedUp: boolean;
    reservationPeriods: ReservationPeriodModel[];
  }) {
    this.id = props.id;
    this.imageUrl = props.imageUrl;
    this.rentPrice = props.rentPrice;
    this.color = props.color;
    this.model = props.model;
    this.fabric = props.fabric;
    this.isPickedUp = props.isPickedUp;
    this.reservationPeriods = props.reservationPeriods;
  }
}

export class ReservationPeriodModel {
  @PrimaryColumn({
    type: "uuid",
  })
  id: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => DressModel, (dress) => dress.reservationPeriods)
  dress: DressModel;
}
