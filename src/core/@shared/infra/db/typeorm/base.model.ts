import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

export class BaseModel {
  @PrimaryColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
