import { FileValidator } from "@nestjs/common";

interface CustomFileTypeValidatorOptions {
  fileType: string[];
  message?: string;
}

export class CustomFileTypeValidator extends FileValidator<CustomFileTypeValidatorOptions> {
  constructor(options: CustomFileTypeValidatorOptions) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean {
    const { fileType } = this.validationOptions;
    return fileType.includes(file.mimetype);
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return (
      this.validationOptions.message ||
      `O tipo de arquivo '${file.mimetype}' não é aceito. Apenas ${this.validationOptions.fileType.join(", ")} são permitidos.`
    );
  }
}
