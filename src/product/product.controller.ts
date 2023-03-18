import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationQueryDto } from '../utils/paginate/dto/pagination-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateImageDto } from './dto/image/create-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'El registro se completó satisfactoriamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Hubo un conflicto al realizar el registro',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Registros obtenidos satisfactoriamente',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se ingresaron los paramentros correctamente o la página solicitada no existe',
  })
  @ApiQuery({
    name: 'page',
    description: 'Por defecto se buscará la página 1',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Por defecto el límite de registros a mostrar será 10',
    required: false,
  })
  findAll(
    @Query()
    paginationQuery: PaginationQueryDto,
  ) {
    return this.productService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Registro obtenido satisfactoriamente',
  })
  @ApiResponse({
    status: 500,
    description: 'No se encontró ningun registro solicitado',
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado satisfactoriamente',
  })
  @ApiResponse({
    status: 500,
    description: 'No se encontró ningun registro solicitado',
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado satisfactoriamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró ningun registro solicitado',
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Post(':id/image')
  @ApiResponse({
    status: 201,
    description: 'Imagen guardado correctamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Hubo un conflicto al guardar la Imagen',
  })
  @UseInterceptors(FileInterceptor('image'))
  saveImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createImagesDto: CreateImageDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    createImagesDto.image = image;
    return this.productService.saveImage(id, createImagesDto);
  }

  @Get(':id/image')
  @ApiResponse({
    status: 200,
    description: 'Registros obtenidos satisfactoriamente',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se ingresaron los paramentros correctamente o la página solicitada no existe',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el Producto Solicitado',
  })
  findImages(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findImages(id);
  }

  @Delete('image/:id')
  @ApiResponse({
    status: 200,
    description: 'Image eliminada satisfactoriamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la Imagen solicitada',
  })
  removeImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.removeImage(id);
  }
}
