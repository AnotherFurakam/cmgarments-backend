import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { SaleService } from "./sale.service";
import { PaginationQueryDto } from "src/utils/paginate/dto";

@Controller('sale')
@ApiTags('Sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}
    @Post()
    @ApiResponse({
        status: 201,
        description: 'El registro se completó satisfactoriamente',
    })
    @ApiResponse({
        status: 409,
        description: 'Hubo un conflicto al realizar el registro',
    })
    create(@Body() createSaleDto: CreateSaleDto) {
        return this.saleService.create(createSaleDto);
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
        return this.saleService.findAll(paginationQuery);
    }

    @Get('/detail')
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
    findAllDetail(
        @Query()
        paginationQuery: PaginationQueryDto,
    ) {
        return this.saleService.findAllDetails(paginationQuery);
    }

    @Get('/detail/:id')
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
    findSaleDetail(@Param('id') id: string,
        @Query()
        paginationQuery: PaginationQueryDto,
    ) {
        return this.saleService.findSaleDetails(id, paginationQuery);
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
        return this.saleService.remove(id);
    }
}