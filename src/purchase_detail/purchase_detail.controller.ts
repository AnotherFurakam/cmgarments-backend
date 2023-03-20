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
import { CreatePurchaseDetailDto } from './dto/create-purchase-detail.dto';
import { UpdatePurchaseDetailDto } from './dto/update-purchase-detail.dto';
import { PurchaseDetailService } from './purchase_detail.service';

@Controller('purchase-detail')
@ApiTags('Purchase detail')
export class PurchaseDetailController {
  constructor(private readonly purchaseDetailService: PurchaseDetailService) {}

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
  create(@Body() createPurchaseDetailDto: CreatePurchaseDetailDto) {
    return this.purchaseDetailService.create(createPurchaseDetailDto);
  }

  // Obtener todos los detalles de una compra:
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
    return this.purchaseDetailService.findAll(paginationQuery);
  }

  // Obtener todos los detalles de compra por el id de compra:
  @Get('purchase/:id')
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
  findAllByIdPurchase(
    @Query()
    paginationQuery: PaginationQueryDto,
    @Param('id') id: string,
  ) {
    return this.purchaseDetailService.findAllByIdPurchase(id, paginationQuery);
  }

  // Obtener detalle de compra por id;
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
    return this.purchaseDetailService.findOne(id);
  }
  //Actualizar detalle de compra:
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
    @Body() updatePurchaseDetailDto: UpdatePurchaseDetailDto,
  ) {
    return this.purchaseDetailService.update(id, updatePurchaseDetailDto);
  }

  //Eliminar detalle de compra:
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
    return this.purchaseDetailService.remove(id);
  }
}
