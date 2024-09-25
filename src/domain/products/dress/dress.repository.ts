import { Dress } from "@domain/products/dress/dress.aggregate";
import { DressId } from "@domain/products/dress/dress-id.vo";

export interface DressRepository {
  save(dress: Dress): Promise<DressId>;
  saveMany(dresses: Dress[]): Promise<void>;
  findById(dressId: DressId): Promise<Dress | undefined>;
  findByIds(dressIds: DressId[]): Promise<Dress[]>;
  exists(dressId: DressId): Promise<boolean>;
  existsMany(dressIds: DressId[]): Promise<{
    exists: DressId[];
    notExists: DressId[];
  }>;

  pickupById(dressId: DressId): Promise<void>;
  returnById(dressId: DressId): Promise<void>;
}
