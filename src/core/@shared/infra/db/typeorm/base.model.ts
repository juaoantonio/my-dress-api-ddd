import { PrimaryColumn } from "typeorm";

export class BaseModel {
  @PrimaryColumn("uuid")
  id: string;
}
