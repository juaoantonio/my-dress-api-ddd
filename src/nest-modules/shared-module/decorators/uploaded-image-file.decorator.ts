import {
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CustomFileTypeValidator } from "@nest/shared-module/validators/custom-file.validator";
import { FileInterceptor } from "@nestjs/platform-express";

export type ImageFile = Express.Multer.File;

export function UploadedImage(fieldName: string, required = true) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: any,
  ) {
    const pipe = new ParseFilePipe({
      validators: [
        new CustomFileTypeValidator({
          fileType: ["image/jpeg", "image/png"],
        }),
        new MaxFileSizeValidator({
          maxSize: 3 * 1024 * 1024,
          message: "O tamanho máximo do arquivo é de 3MB",
        }),
      ],
      fileIsRequired: required,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
    UseInterceptors(FileInterceptor(fieldName))(
      target,
      propertyKey,
      parameterIndex,
    );
    UploadedFile(pipe)(target, propertyKey, parameterIndex);
  };
}
