import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationQueryDto } from "src/utils/paginate/dto";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { SupplierService } from "./supplier.service";

@Controller('supplier')
@ApiTags('Supplier')
export class SupplierController{
    constructor(private readonly supplierService: SupplierService) {}

    @Post()
    @ApiResponse({
        status: 201,
        description: 'El registro se completó satisfactoriamente',
    })
    @ApiResponse({
        status: 409,
        description: 'Hubo un conflicto al realizar el registro',
    })
    create(@Body() createSupplierDto: CreateSupplierDto) {
        return this.supplierService.create(createSupplierDto);
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
        return this.supplierService.findAll(paginationQuery);
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
        return this.supplierService.findOne(id);
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
    update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
        return this.supplierService.update(id, updateSupplierDto);
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
        return this.supplierService.remove(id);
    }
}