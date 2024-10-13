import { ClutchTypeormRepository } from "@core/products/infra/db/typeorm/clutch/clutch.typeorm-repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";
import { Repository } from "typeorm";
import { CreateClutchUseCase } from "@core/products/application/clutch/create-clutch/create-clutch.use.case";
import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { S3ImageStorage } from "@core/@shared/infra/s3/s3.image-storage";
import { ProviderType } from "@nest/shared-module/types/provider.type";
import { DeleteClutchUseCase } from "@core/products/application/clutch/delete-clutch/delete-clutch.use-case";
import { GetPaginatedClutchesUseCase } from "@core/products/application/clutch/get-paginated-clutches/get-paginated-clutches.use-case";
import { UpdateClutchUseCase } from "@core/products/application/clutch/update-clutch/update-clutch.use-case";

export const REPOSITORIES: ProviderType = {
  DEFAULT_CLUTCH_REPOSITORY: {
    provide: "IClutchRepository",
    useExisting: ClutchTypeormRepository,
  },
  TYPEORM_CLUTCH_REPOSITORY: {
    provide: ClutchTypeormRepository,
    useFactory: (clutchRepository: Repository<ClutchModel>) => {
      return new ClutchTypeormRepository(clutchRepository);
    },
    inject: [getRepositoryToken(ClutchModel)],
  },
};

export const SERVICES: ProviderType = {
  DEFAULT_IMAGE_STORAGE_SERVICE: {
    provide: "IImageStorageService",
    useClass: S3ImageStorage,
  },
};

export const USE_CASES: ProviderType = {
  CREATE_CLUTCH_USE_CASE: {
    provide: CreateClutchUseCase,
    useFactory: (
      clutchRepository: IClutchRepository,
      uploadService: IImageStorageService,
    ) => {
      return new CreateClutchUseCase(clutchRepository, uploadService);
    },
    inject: [
      REPOSITORIES.DEFAULT_CLUTCH_REPOSITORY.provide,
      SERVICES.DEFAULT_IMAGE_STORAGE_SERVICE.provide,
    ],
  },

  DELETE_CLUTCH_USE_CASE: {
    provide: DeleteClutchUseCase,
    useFactory: (
      clutchRepository: IClutchRepository,
      uploadService: IImageStorageService,
    ) => {
      return new DeleteClutchUseCase(clutchRepository, uploadService);
    },
    inject: [
      REPOSITORIES.DEFAULT_CLUTCH_REPOSITORY.provide,
      SERVICES.DEFAULT_IMAGE_STORAGE_SERVICE.provide,
    ],
  },

  GET_PAGINATED_CLUTCHES_USE_CASE: {
    provide: GetPaginatedClutchesUseCase,
    useFactory: (
      clutchRepository: IClutchRepository,
      uploadService: IImageStorageService,
    ) => {
      return new GetPaginatedClutchesUseCase(clutchRepository, uploadService);
    },
    inject: [
      REPOSITORIES.DEFAULT_CLUTCH_REPOSITORY.provide,
      SERVICES.DEFAULT_IMAGE_STORAGE_SERVICE.provide,
    ],
  },

  UPDATE_CLUTCH_USE_CASE: {
    provide: UpdateClutchUseCase,
    useFactory: (
      clutchRepository: IClutchRepository,
      uploadService: IImageStorageService,
    ) => {
      return new UpdateClutchUseCase(clutchRepository, uploadService);
    },
    inject: [
      REPOSITORIES.DEFAULT_CLUTCH_REPOSITORY.provide,
      SERVICES.DEFAULT_IMAGE_STORAGE_SERVICE.provide,
    ],
  },
};

export const CLUTCH_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  SERVICES,
};
