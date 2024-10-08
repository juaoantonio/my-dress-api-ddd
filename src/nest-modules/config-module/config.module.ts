import { Module } from "@nestjs/common";
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from "@nestjs/config";
import { join } from "path";
import Joi from "joi";

type DB_SCHEMA_TYPE = {
  DB_VENDOR: "postgres" | "sqlite";
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
  DB_SYNCHRONIZE?: boolean;
};

type AWS_S3_SCHEMA_TYPE = {
  AWS_REGION: string;
  AWS_S3_BUCKET_NAME: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_ACCESS_KEY_ID: string;
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE & AWS_S3_SCHEMA_TYPE;

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: Joi.string().required().valid("postgres", "sqlite"),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().when("DB_VENDOR", {
    is: "postgres",
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when("DB_VENDOR", {
    is: "postgres",
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when("DB_VENDOR", {
    is: "postgres",
    then: Joi.required(),
  }),
  DB_PORT: Joi.number().integer().when("DB_VENDOR", {
    is: "postgres",
    then: Joi.required(),
  }),
  DB_LOGGING: Joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
};

export const CONFIG_AWS_S3_SCHEMA: Joi.StrictSchemaMap<AWS_S3_SCHEMA_TYPE> = {
  AWS_REGION: Joi.string().required().default("us-east-1"),
  AWS_S3_BUCKET_NAME: Joi.string().required().default("mydressprod"),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
};

// https://docs.nestjs.com/modules#dynamic-modules
// https://docs.nestjs.com/techniques/configuration#configuration
@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const { envFilePath, ...otherOptions } = options;
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath! : [envFilePath!]),
        join(process.cwd(), "envs", `.env.${process.env.NODE_ENV!}`),
        join(process.cwd(), "envs", `.env`),
      ],
      validationSchema: Joi.object({
        ...CONFIG_DB_SCHEMA,
        ...CONFIG_AWS_S3_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}
