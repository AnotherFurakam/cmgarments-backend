import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/utils/paginate/dto';

@Controller('brand')
@ApiTags('Brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'El registro se completó satisfactoriamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Hubo un conflicto al realizar el registro',
  })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
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
    return this.brandService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Registro obtenido satisfactoriamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró ningun registro solicitado',
  })
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado satisfactoriamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró ningun registro solicitado',
  })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
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
    return this.brandService.remove(id);
  }
}
