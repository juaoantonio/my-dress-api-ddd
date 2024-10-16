import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { CreateClutchUseCase } from "@core/products/application/clutch/create-clutch/create-clutch.use.case";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
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
import { UpdateClutchUseCase } from "@core/products/application/clutch/update-clutch/update-clutch.use-case";
import {
  ImageFile,
  UploadedImage,
} from "@nest/shared-module/decorators/uploaded-image-file.decorator";
import {
  CreateClutchDto,
  UpdateClutchDto,
} from "@nest/clutch-module/dto/clutch.dto";
import { GetClutchUseCase } from "@core/products/application/clutch/get-clutch/get-clutch.use-case";
import { ClutchOutput } from "@core/products/application/clutch/common/clutch.output-mapper";

@ApiBearerAuth()
@ApiTags("Bolsas")
@Controller("clutches")
export class ClutchController {
  @Inject(CreateClutchUseCase)
  private createClutchUseCase: CreateClutchUseCase;

  @Inject(DeleteClutchUseCase)
  private deleteClutchUseCase: DeleteClutchUseCase;

  @Inject(UpdateClutchUseCase)
  private updateClutchUseCase: UpdateClutchUseCase;

  @Inject(GetClutchUseCase)
  private getClutchUseCase: GetClutchUseCase;

  @Inject(GetPaginatedClutchesUseCase)
  private getPaginatedClutchesUseCase: GetPaginatedClutchesUseCase;

  @ApiOperation({
    summary: "Cadastrar uma bolsa",
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Bolsa cadastrada com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Entidade inválida",
  })
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async createClutch(
    @UploadedImage("image") image: ImageFile,
    @Body() input: CreateClutchDto,
  ) {
    await this.createClutchUseCase.execute({
      image,
      color: input.color,
      model: input.model,
      rentPrice: input.rentPrice,
    });
  }

  @ApiOperation({
    summary: "Deletar uma bolsa",
  })
  @ApiParam({
    name: "id",
    required: true,
    type: "string",
    description: "Identificador da bolsa",
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Bolsa deletada com sucesso",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async deleteClutch(@Param("id", new ParseUUIDPipe()) id: string) {
    await this.deleteClutchUseCase.execute({ id });
  }

  @ApiOperation({
    summary: "Atualizar uma bolsa",
  })
  @ApiConsumes("multipart/form-data")
  @ApiParam({
    name: "id",
    required: true,
    type: "string",
    description: "Identificador da bolsa",
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Bolsa atualizada com sucesso",
  })
  @Patch(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor("image"))
  async updateClutch(
    @UploadedImage("image", false) image: ImageFile,
    @Body() input: UpdateClutchDto,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    await this.updateClutchUseCase.execute({
      id,
      image,
      color: input.color,
      model: input.model,
      rentPrice: input.rentPrice,
    });
  }

  @ApiOperation({
    summary: "Buscar uma bolsa",
  })
  @ApiParam({
    name: "id",
    required: true,
    type: "string",
    description: "Identificador da bolsa",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Bolsa buscada com sucesso",
    example: {
      id: "667cb46b-fd52-4a5b-bdb2-1d8cc2e525ef",
      rentPrice: 150,
      name: "Prata, Sem alça",
      color: "Prata",
      model: "Sem alça",
      isPickedUp: false,
      imageUrl: "https://example.com/image1.jpg",
      type: "clutch",
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Bolsa não encontrada",
  })
  @Get(":id")
  async getClutch(
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<ClutchOutput> {
    return await this.getClutchUseCase.execute({ id });
  }

  @ApiOperation({
    summary: "Listar bolsas com paginação",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Bolsas listadas com sucesso",
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
