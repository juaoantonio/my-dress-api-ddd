import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CreateDressUseCase } from "@core/products/application/dress/create-dress/create-dress.use.case";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { CustomFileTypeValidator } from "@nest/shared-module/validators/custom-file.validator";
import { CreateDressDto } from "@nest/dress-module/dto/create-dress.dto";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import "multer";

@ApiTags("dresses")
@Controller("dresses")
export class DressController {
  @Inject(CreateDressUseCase)
  private createDressUseCase: CreateDressUseCase;

  @ApiOperation({
    summary: "Cadastrar um vestido",
  })
  @ApiParam({
    name: "file",
    required: true,
    type: "file",
    description: "Imagem do vestido",
  })
  @ApiBody({
    type: CreateDressDto,
    description: "Dados necessários para cadastrar um vestido",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Vestido cadastrado com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Entidade inválida",
  })
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async createDress(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomFileTypeValidator({
            fileType: ["image/jpeg", "image/png"],
          }),
        )
        .addMaxSizeValidator({
          maxSize: 3 * 1024 * 1024, // 3MB
          message: "O arquivo excede o tamanho máximo permitido de 3MB",
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() input: CreateDressDto,
  ) {
    await this.createDressUseCase.execute({
      imageFileName: file.originalname,
      imageBody: file.buffer,
      imageMimetype: file.mimetype,
      color: input.color,
      fabric: input.fabric,
      model: input.model,
      rentPrice: input.rentPrice,
    });
  }
}
