import { Entity } from "typeorm";
import { ProductModel } from "@core/products/infra/db/typeorm/product.model";

@Entity("clutches")
export class ClutchModel extends ProductModel {}
