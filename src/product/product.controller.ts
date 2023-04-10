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
import { SearchDto } from './dto/search.dto';
import { FilterByDateDto } from './dto/filtro-by-fecha.dto';
import { RecentProductsQueryDto } from './dto/recent-products-query.dto';

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

  @Get(':id/sizes')
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
  findRelationSizes(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findRelationSizes(id);
  }

  @Get('relation/:id/:size')
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
  findNameSizes(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('size') size: string,
  ) {
    return this.productService.findNameSize(id, size);
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

  @Delete('image/all/:id')
  @ApiResponse({
    status: 200,
    description: 'Imagenes eliminadas satisfactoriamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron las Imagenes solicitadas',
  })
  removeAllImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.removeAllImage(id);
  }

  @Get('count/quantity')
  @ApiResponse({
    status: 200,
    description: 'Cantidad de Productos obtenidas satisfactoriamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Ocurrio un error al obtener cantidad de Productos',
  })
  getQuantity() {
    return this.productService.getQuantity();
  }

  @Get('search/by')
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado satisfactoriamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al buscar el producto',
  })
  searchProducto(@Query() searchDto: SearchDto) {
    return this.productService.searchProduct(searchDto, {
      limit: 8,
      page: 1,
    } as PaginationQueryDto);
  }

  @Get('filter/items')
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado satisfactoriamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al filtrar el producto',
  })
  filterProductoByFecha(@Query() filterDto: FilterByDateDto) {
    return this.productService.filterByDate(filterDto, {
      limit: 8,
      page: 1,
    } as PaginationQueryDto);
  }

  @Get('recents/items/')
  getRecentsProducts(@Query() { quantity }: RecentProductsQueryDto) {
    return this.productService.getRecentsProducts(quantity);
  }

  //
  @Get('brand/:id')
  @ApiResponse({
    status: 200,
    description: 'Registros obtenidos satisfactoriamente',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se ingresaron los paramentros correctamente o la página solicitada no existe',
  })
  findAllByIdBrand(@Param('id') id: string) {
    return this.productService.findAllByIdBrand(id, { limit: 8, page: 1 });
  }

  //
  @Get('category/:id')
  @ApiResponse({
    status: 200,
    description: 'Registros obtenidos satisfactoriamente',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se ingresaron los paramentros correctamente o la página solicitada no existe',
  })
  findAllByIdCategory(@Param('id') id: string) {
    return this.productService.findAllByIdCategory(id, { limit: 8, page: 1 });
  }
}
