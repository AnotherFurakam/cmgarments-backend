import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginationQueryDto } from "src/utils/paginate/dto";
import { CreateEntranceDto } from "./dto/create.entrance.dto";
import { UpdateEntranceDto } from "./dto/update.entrance.dto";
import { EntranceService } from "./entrance.service";

@Controller('entrance')
@ApiTags('Entrance')
export class EntranceController{
    constructor(private readonly entranceService: EntranceService) {}

    @Post()
    @ApiResponse({
      status: 201,
      description: 'El registro se completó satisfactoriamente',
    })
    @ApiResponse({
      status: 409,
      description: 'Hubo un conflicto al realizar el registro',
    })
    create(@Body() createEntranceDto: CreateEntranceDto) {
      return this.entranceService.create(createEntranceDto);
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
      return this.entranceService.findAll(paginationQuery);
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
      return this.entranceService.findOne(id);
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
    update(@Param('id') id: string, @Body() updateEntranceDto: UpdateEntranceDto ) {
      return this.entranceService.update(id, updateEntranceDto);
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
      return this.entranceService.remove(id);
    }
}