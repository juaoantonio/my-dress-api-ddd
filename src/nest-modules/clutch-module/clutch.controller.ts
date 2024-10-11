import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CreateClutchUseCase } from "@core/products/application/clutch/create-clutch/create-clutch.use.case";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { CustomFileTypeValidator } from "@nest/shared-module/validators/custom-file.validator";
import { CreateClutchDto } from "@nest/clutch-module/dto/create-clutch.dto";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import "multer";
import { DeleteClutchUseCase } from "@core/products/application/clutch/delete-clutch/delete-clutch.use-case";
import { GetPaginatedClutchesUseCase } from "@core/products/application/clutch/get-paginated-clutches/get-paginated-clutches.use-case";
import {
  GetPaginatedClutchesInputDto,
  GetPaginatedClutchesOutputDto,
} from "@nest/clutch-module/dto/get-paginated-clutches.dto";

@ApiTags("Bolsas")
@Controller("clutches")
export class ClutchController {
  @Inject(CreateClutchUseCase)
  private createClutchUseCase: CreateClutchUseCase;

  @Inject(DeleteClutchUseCase)
  private deleteClutchUseCase: DeleteClutchUseCase;

  @Inject(GetPaginatedClutchesUseCase)
  private getPaginatedClutchesUseCase: GetPaginatedClutchesUseCase;

  @ApiOperation({
    summary: "Cadastrar um bolsa",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Dados necessários para cadastrar um vestido",
    required: true,
    schema: {
      type: "object",
      properties: {
        color: {
          type: "string",
          description: "Cor da bolsa",
          example: "Prata",
        },
        model: {
          type: "string",
          description: "Modelo da bolsa",
          example: "Sem alça",
        },
        rentPrice: {
          type: "number",
          description: "Preço de aluguel da bolsa",
          example: 200.0,
        },
        file: {
          type: "string",
          format: "binary",
          description: "Imagem da bolsa",
        },
      },
      required: ["color", "model", "rentPrice", "file"],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Bolsa cadastrado com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Entidade inválida",
  })
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async createClutch(
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
    @Body() input: CreateClutchDto,
  ) {
    await this.createClutchUseCase.execute({
      imageFileName: file.originalname,
      imageBody: file.buffer,
      imageMimetype: file.mimetype,
      color: input.color,
      model: input.model,
      rentPrice: input.rentPrice,
    });
  }

  @ApiOperation({
    summary: "Deletar um bolsa",
  })
  @ApiParam({
    name: "id",
    required: true,
    type: "string",
    description: "Identificador do bolsa",
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Bolsa deletado com sucesso",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async deleteClutch(@Param("id") id: string) {
    await this.deleteClutchUseCase.execute({ id });
  }

  @ApiOperation({
    summary: "Listar bolsas com paginação",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Bolsas listados com sucesso",
    type: GetPaginatedClutchesOutputDto,
  })
  @Get()
  async getPaginatedClutches(
    @Query() query: GetPaginatedClutchesInputDto,
  ): Promise<GetPaginatedClutchesOutputDto> {
    const page = query.page || 1;
    const limit = query.limit || 15;
    return await this.getPaginatedClutchesUseCase.execute({
      page,
      limit,
      available: query.available,
      endDate: query.endDate,
      startDate: query.startDate,
    });
  }
}
