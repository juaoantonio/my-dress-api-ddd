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
  UsePipes,
  ValidationPipe,
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
import { DeleteDressUseCase } from "@core/products/application/dress/delete-dress/delete-dress.use-case";
import { GetPaginatedDressesUseCase } from "@core/products/application/dress/get-paginated-dresses/get-paginated-dresses.use-case";
import {
  GetPaginatedDressesInputDto,
  GetPaginatedDressesOutputDto,
} from "@nest/dress-module/dto/get-paginated-dresses.dto";

@ApiTags("Vestidos")
@Controller("dresses")
export class DressController {
  @Inject(CreateDressUseCase)
  private createDressUseCase: CreateDressUseCase;

  @Inject(DeleteDressUseCase)
  private deleteDressUseCase: DeleteDressUseCase;

  @Inject(GetPaginatedDressesUseCase)
  private getPaginatedDressesUseCase: GetPaginatedDressesUseCase;

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

  @ApiOperation({
    summary: "Deletar um vestido",
  })
  @ApiParam({
    name: "id",
    required: true,
    type: "string",
    description: "Identificador do vestido",
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Vestido deletado com sucesso",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async deleteDress(@Param("id") id: string) {
    await this.deleteDressUseCase.execute({ id });
  }

  @ApiOperation({
    summary: "Listar vestidos com paginação",
  })
  @ApiBody({
    type: GetPaginatedDressesInputDto,
    description: "Dados necessários para listar vestidos com paginação",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Vestidos listados com sucesso",
    type: GetPaginatedDressesOutputDto,
  })
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPaginatedDresses(
    @Query() query: GetPaginatedDressesInputDto,
  ): Promise<GetPaginatedDressesOutputDto> {
    const page = query.page || 1;
    const limit = query.limit || 15;
    console.log(query);
    return await this.getPaginatedDressesUseCase.execute({
      page,
      limit,
      available: query.available,
      endDate: query.endDate,
      startDate: query.startDate,
    });
  }
}
