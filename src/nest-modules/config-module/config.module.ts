import { Module } from "@nestjs/common";
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from "@nestjs/config";
import { join } from "path";
import Joi, { ArraySchema } from "joi";
import { CommonUser } from "@nest/users-module/users.service";

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
  AWS_ENDPOINT?: string;
  AWS_SSL_ENABLED?: boolean;
  AWS_S3_FORCE_PATH_STYLE?: boolean;
};

type JWT_SCHEMA_TYPE = {
  JWT_SECRET: string;
};

type USERS_SCHEMA_TYPE = {
  USERS: CommonUser[];
};

type ENV_SCHEMA_TYPE = {
  NODE_ENV?: string;
  PORT?: number;
};

type CORS_SCHEMA_TYPE = {
  CORS_ORIGIN: string[];
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE &
  AWS_S3_SCHEMA_TYPE &
  USERS_SCHEMA_TYPE &
  JWT_SCHEMA_TYPE &
  ENV_SCHEMA_TYPE &
  CORS_SCHEMA_TYPE;

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
  AWS_ENDPOINT: Joi.string().optional(),
  AWS_SSL_ENABLED: Joi.boolean().optional().default(true),
  AWS_S3_FORCE_PATH_STYLE: Joi.boolean().optional().default(true),
};

export const CONFIG_JWT_SCHEMA: Joi.StrictSchemaMap<JWT_SCHEMA_TYPE> = {
  JWT_SECRET: Joi.string().required(),
};

const COMMON_USER_SCHEMA: Joi.StrictSchemaMap<CommonUser> = {
  userId: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
};

export const CONFIG_USERS_SCHEMA: Joi.StrictSchemaMap<USERS_SCHEMA_TYPE> = {
  USERS: Joi.string()
    .custom((value, helpers) => {
      try {
        // Tenta fazer o parse da string para JSON
        const parsedValue = JSON.parse(value);
        if (!Array.isArray(parsedValue)) {
          return helpers.error("any.invalid", { value });
        }
        const { error } = Joi.array()
          .items(COMMON_USER_SCHEMA)
          .validate(parsedValue);
        if (error) {
          return helpers.error("any.invalid", { value });
        }
        return parsedValue as CommonUser[];
      } catch (err) {
        return helpers.error("any.invalid", { value }); // Erro caso não seja um JSON válido
      }
    })
    .messages({
      "any.invalid":
        "USERS precisa ser uma string JSON que represente um array válido de usuários",
    }) as unknown as ArraySchema<CommonUser[]>,
};

export const CONFIG_ENV_SCHEMA: Joi.StrictSchemaMap<ENV_SCHEMA_TYPE> = {
  NODE_ENV: Joi.string().optional().default("development"),
  PORT: Joi.number().integer().optional().default(3000),
};

export const CONFIG_CORS_SCHEMA: Joi.StrictSchemaMap<CORS_SCHEMA_TYPE> = {
  CORS_ORIGIN: Joi.string()
    .custom((value, helpers) => {
      try {
        const parsedValue = JSON.parse(value);
        if (!Array.isArray(parsedValue)) {
          return helpers.error("any.invalid", { value });
        }
        const { error } = Joi.array().items(Joi.string()).validate(parsedValue);
        if (error) {
          return helpers.error("any.invalid", { value });
        }
        return parsedValue as string[];
      } catch (err) {
        return helpers.error("any.invalid", { value });
      }
    })
    .messages({
      "any.invalid":
        "CORS_ORIGIN precisa ser uma string JSON que represente um array válido de origens",
    })
    .when("NODE_ENV", {
      is: "production",
      then: Joi.required(),
    }) as unknown as ArraySchema<string[]>,
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
        ...CONFIG_USERS_SCHEMA,
        ...CONFIG_JWT_SCHEMA,
        ...CONFIG_ENV_SCHEMA,
        ...CONFIG_CORS_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}
