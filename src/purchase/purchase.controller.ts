import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/utils/paginate/dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PurchaseService } from './purchase.service';
@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  //Registrar compra:
  @Post()
  @ApiResponse({
    status: 201,
    description: 'El registro se completó satisfactoriamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Hubo un conflicto al realizar el registro',
  })
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto);
  }

  // Obtener todos los compras:
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
    return this.purchaseService.findAll(paginationQuery);
  }
  // Obtener compra por id;
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
    return this.purchaseService.findOne(id);
  }

  //Actualizar compra:
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado satisfactoriamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró ningun registro solicitado',
  })
  update(
    @Param('id') id: string,
    @Body() updatePurchaseeDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(id, updatePurchaseeDto);
  }

  //Eliminar compra:
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
    return this.purchaseService.remove(id);
  }
}
