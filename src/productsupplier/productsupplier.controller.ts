import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationQueryDto } from "src/utils/paginate/dto";
import { CreateProductSupplierDto } from "./dto/create-productsupplier.dto";
import { UpdateProductSupplierDto } from "./dto/update-productsupplier.dto";
import { ProductSupplierService } from "./productsupplier.service";

@Controller('productsupplier')
@ApiTags('ProductSupplier')
export class ProductSupplierController{
    constructor(private readonly productSupplierService: ProductSupplierService) {}
    @Post()
    @ApiResponse({
      status: 201,
      description: 'El registro se completó satisfactoriamente',
    })
    @ApiResponse({
      status: 409,
      description: 'Hubo un conflicto al realizar el registro',
    })
    create(@Body() createSupplierProductDto: CreateProductSupplierDto) {
      return this.productSupplierService.create(createSupplierProductDto);
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
      return this.productSupplierService.findAll(paginationQuery);
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
      return this.productSupplierService.findOne(id);
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
    update(@Param('id') id: string, @Body() updateProductSupplierDto: UpdateProductSupplierDto) {
      return this.productSupplierService.update(id, updateProductSupplierDto);
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
      return this.productSupplierService.remove(id);
    }
}
