import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/utils/paginate/dto';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Categoría creada satisfactoriamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Hubo un conflicto al crear la Categoría',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Categorías obtenidas satisfactoriamente',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se ingresaron los parámentros correctamente o la página solicitada no existe',
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
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.categoryService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Categoría creada satisfactoriamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró ninguna Categoría',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada satisfactoriamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la Categoría solicitada',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Categoría eliminada satisfactoriamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la Categoría solicitada',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.remove(id);
  }
}
