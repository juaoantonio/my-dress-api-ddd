import {
  ClassProvider,
  ExistingProvider,
  FactoryProvider,
} from "@nestjs/common";

export type ProviderType = Record<
  string,
  ExistingProvider | FactoryProvider | ClassProvider
>;
