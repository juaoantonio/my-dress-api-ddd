import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { Repository } from "typeorm";
import { CreateDressUseCase } from "@core/products/application/dress/create-dress/create-dress.use.case";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { S3ImageStorage } from "@core/@shared/infra/s3/s3.image-storage";
import { ProviderType } from "@nest/shared-module/types/provider.type";

export const REPOSITORIES: ProviderType = {
  DEFAULT_EXAMPLE_REPOSITORY: {
    provide: "IDressRepository",
    useExisting: DressTypeormRepository,
  },
  TYPEORM_APPOINTMENT_REPOSITORY: {
    provide: DressTypeormRepository,
    useFactory: (exampleRepository: Repository<DressModel>) => {
      return new DressTypeormRepository(exampleRepository);
    },
    inject: [getRepositoryToken(DressModel)],
  },
};

export const SERVICES: ProviderType = {
  DEFAULT_IMAGE_STORAGE_SERVICE: {
    provide: "IImageStorageService",
    useClass: S3ImageStorage,
  },
};

export const USE_CASES: ProviderType = {
  CREATE_DRESS_USE_CASE: {
    provide: CreateDressUseCase,
    useFactory: (
      dressRepository: IDressRepository,
      uploadService: IImageStorageService,
    ) => {
      return new CreateDressUseCase(dressRepository, uploadService);
    },
    inject: [
      REPOSITORIES.DEFAULT_EXAMPLE_REPOSITORY.provide,
      SERVICES.DEFAULT_IMAGE_STORAGE_SERVICE.provide,
    ],
  },
};

export const DRESS_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  SERVICES,
};
