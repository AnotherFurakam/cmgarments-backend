import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/utils/paginate/dto';
import { CreatePurchaseDetailDto } from './dto/create-purchase-detail.dto';
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

  // Obtener todos los empleados:
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
  // Obtener empleados por id;
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
}
