import { Column, Entity } from "typeorm";
import { ProductModel } from "@core/products/infra/db/typeorm/product.model";

@Entity("dresses")
export class DressModel extends ProductModel {
  @Column("varchar")
  fabric: string;
}
