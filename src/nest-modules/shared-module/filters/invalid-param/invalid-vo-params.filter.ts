import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { InvalidVoFields } from "@core/@shared/domain/error/invalid-vo-params";
import { union } from "lodash";

@Catch(InvalidVoFields)
export class InvalidVoParamsErrorFilter implements ExceptionFilter {
  catch(exception: InvalidVoFields, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(400).json({
      statusCode: 400,
      error: "Bad Request",
      message: union(
        ...exception.errors.reduce(
          (acc, error) =>
            acc.concat(
              //@ts-expect-error - error can be string
              typeof error === "string"
                ? [[error]]
                : [
                    Object.values(error).reduce(
                      (acc, error) => acc.concat(error),
                      [] as string[],
                    ),
                  ],
            ),
          [] as string[],
        ),
      ),
    });
  }
}
