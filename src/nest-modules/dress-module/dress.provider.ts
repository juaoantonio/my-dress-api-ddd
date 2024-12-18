import { DressTypeormRepository } from "@core/products/infra/db/typeorm/dress/dress.typeorm-repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { Repository } from "typeorm";
import { CreateDressUseCase } from "@core/products/application/dress/create-dress/create-dress.use.case";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { S3ImageStorage } from "@core/@shared/infra/s3/s3.image-storage";
import { ProviderType } from "@nest/shared-module/types/provider.type";
import { DeleteDressUseCase } from "@core/products/application/dress/delete-dress/delete-dress.use-case";
import { GetPaginatedDressesUseCase } from "@core/products/application/dress/get-paginated-dresses/get-paginated-dresses.use-case";
import { UpdateDressUseCase } from "@core/products/application/dress/update-dress/update-dress.use-case";
import { GetDressUseCase } from "@core/products/application/dress/get-dress/get-dress.use-case";

export const REPOSITORIES: ProviderType = {
  DEFAULT_DRESS_REPOSITORY: {
    provide: "IDressRepository",
    useExisting: DressTypeormRepository,
  },
  TYPEORM_DRESS_REPOSITORY: {
    provide: DressTypeormRepository,
    useFactory: (dressRepository: Repository<DressModel>) => {
      return new DressTypeormRepository(dressRepository);
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
      REPOSITORIES.DEFAULT_DRESS_REPOSITORY.provide,
      SERVICES.DEFAULT_IMAGE_STORAGE_SERVICE.provide,
    ],
  },

  DELETE_DRESS_USE_CASE: {
    provide: DeleteDressUseCase,
    useFactory: (
      dressRepository: IDressRepository,
      uploadService: IImageStorageService,
    ) => {
      return new DeleteDressUseCase(dressRepository, uploadService);
    },
    inject: [
      REPOSITORIES.DEFAULT_DRESS_REPOSITORY.provide,
      SERVICES.DEFAULT_IMAGE_STORAGE_SERVICE.provide,
    ],
  },

  GET_DRESS_USE_CASE: {
    provide: GetDressUseCase,
    useFactory: (
      dressRepository: IDressRepository,
      uploadService: IImageStorageService,
    ) => {
      return new GetDressUseCase(dressRepository, uploadService);
    },
    inject: [
      REPOSITORIES.DEFAULT_DRESS_REPOSITORY.provide,
      SERVICES.DEFAULT_IMAGE_STORAGE_SERVICE.provide,
    ],
  },

  GET_PAGINATED_DRESSES_USE_CASE: {
    provide: GetPaginatedDressesUseCase,
    useFactory: (
      dressRepository: IDressRepository,
      uploadService: IImageStorageService,
    ) => {
      return new GetPaginatedDressesUseCase(dressRepository, uploadService);
    },
    inject: [
      REPOSITORIES.DEFAULT_DRESS_REPOSITORY.provide,
      SERVICES.DEFAULT_IMAGE_STORAGE_SERVICE.provide,
    ],
  },

  UPDATE_DRESS_USE_CASE: {
    provide: UpdateDressUseCase,
    useFactory: (
      dressRepository: IDressRepository,
      uploadService: IImageStorageService,
    ) => {
      return new UpdateDressUseCase(dressRepository, uploadService);
    },
    inject: [
      REPOSITORIES.DEFAULT_DRESS_REPOSITORY.provide,
      SERVICES.DEFAULT_IMAGE_STORAGE_SERVICE.provide,
    ],
  },
};

export const DRESS_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  SERVICES,
};
