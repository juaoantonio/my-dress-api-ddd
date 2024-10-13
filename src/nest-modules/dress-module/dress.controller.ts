import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { CreateDressUseCase } from "@core/products/application/dress/create-dress/create-dress.use.case";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
import {
  ImageFile,
  UploadedImage,
} from "@nest/shared-module/decorators/uploaded-image-file.decorator";
import { UpdateDressUseCase } from "@core/products/application/dress/update-dress/update-dress.use-case";
import {
  CreateDressDto,
  UpdateDressDto,
} from "@nest/dress-module/dto/dress.dto";
import { GetDressUseCase } from "@core/products/application/dress/get-dress/get-dress.use-case";
import { DressOutput } from "@core/products/application/dress/common/dress.output-mapper";

@ApiBearerAuth()
@ApiTags("Vestidos")
@Controller("dresses")
export class DressController {
  @Inject(CreateDressUseCase)
  private createDressUseCase: CreateDressUseCase;

  @Inject(DeleteDressUseCase)
  private deleteDressUseCase: DeleteDressUseCase;

  @Inject(UpdateDressUseCase)
  private updateDressUseCase: UpdateDressUseCase;

  @Inject(GetDressUseCase)
  private getDressUseCase: GetDressUseCase;

  @Inject(GetPaginatedDressesUseCase)
  private getPaginatedDressesUseCase: GetPaginatedDressesUseCase;

  @ApiOperation({
    summary: "Cadastrar um vestido",
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
          description: "Cor do vestido",
          example: "Branco",
        },
        fabric: {
          type: "string",
          description: "Tecido do vestido",
          example: "Seda",
        },
        model: {
          type: "string",
          description: "Modelo do vestido",
          example: "Decote V",
        },
        rentPrice: {
          type: "number",
          description: "Preço de aluguel do vestido",
          example: 200.0,
        },
        file: {
          type: "string",
          format: "binary",
          description: "Imagem do vestido",
        },
      },
      required: ["color", "fabric", "model", "rentPrice", "file"],
    },
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
  @UseInterceptors(FileInterceptor("image"))
  async createDress(
    @UploadedImage("image") image: ImageFile,
    @Body() input: CreateDressDto,
  ) {
    await this.createDressUseCase.execute({
      image,
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
    summary: "Atualizar um vestido",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Dados necessários para atualizar um vestido",
    required: true,
    schema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Identificador de um vestido",
          example: "123e4567-e89b-12d3-a456-426614174000",
        },
        color: {
          type: "string",
          description: "Cor do vestido",
          example: "Prata",
        },
        model: {
          type: "string",
          description: "Modelo do vestido",
          example: "Sem alça",
        },
        fabric: {
          type: "string",
          description: "Tecido do vestido",
          example: "Seda",
        },
        rentPrice: {
          type: "number",
          description: "Preço de aluguel do vestido",
          example: 200.0,
        },
        file: {
          type: "string",
          format: "binary",
          description: "Imagem do vestido",
        },
      },
      required: ["id"],
    },
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Vestido atualizado com sucesso",
  })
  @Patch(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor("image"))
  async updateClutch(
    @UploadedImage("image", false) image: ImageFile,
    @Body() input: UpdateDressDto,
  ) {
    await this.updateDressUseCase.execute({
      image,
      id: input.id,
      color: input.color,
      model: input.model,
      fabric: input.fabric,
      rentPrice: input.rentPrice,
    });
  }

  @ApiOperation({
    summary: "Buscar um vestido",
  })
  @ApiQuery({
    name: "id",
    required: true,
    type: "string",
    description: "Identificador do vestido",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Vestido encontrado com sucesso",
    type: DressOutput,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Vestido não encontrado",
  })
  @Get(":id")
  async getDress(@Param("id") id: string) {
    return await this.getDressUseCase.execute({ id });
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
  async getPaginatedDresses(
    @Query() query: GetPaginatedDressesInputDto,
  ): Promise<GetPaginatedDressesOutputDto> {
    const page = query.page || 1;
    const limit = query.limit || 15;
    return await this.getPaginatedDressesUseCase.execute({
      page,
      limit,
      available: query.available,
      endDate: query.endDate,
      startDate: query.startDate,
    });
  }
}
