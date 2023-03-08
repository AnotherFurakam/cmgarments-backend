import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Supplier } from "src/model/supplier.entity";
import { PaginationQueryDto, PaginationResponseDto } from "src/utils/paginate/dto";
import { Repository } from "typeorm";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { GetSupplierDto } from "./dto/get-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>,
    ) {}

    //*Método para crear un proveedor (supplier)
    //Recibimos como parámetro el dto con los datos correspondientes y validados
    async create(createSupplierDto: CreateSupplierDto): Promise<GetSupplierDto> {
        try {
            //Si el supplier no fue registrado se procederá a guardar en la base de datos
            const createSupplier = await this.supplierRepository.save(createSupplierDto);

            //Retornamos los datos del supplier registrado hacia el cliente
            return plainToInstance(GetSupplierDto, createSupplier);
          } catch (error) {
            //Duplicate constraint
            if (error.code === '23505')
              //El código de estado a utilizar sera el CONFLIC -> para indicar conflictos al registrar
              //Si el nombre del supplier ya fue registrado lanzamos un error que diga que ya fue registrado
              throw new ConflictException(
                `El proveedor con el nombre '${createSupplierDto.name}' ya existe.`,
              );
          }
    }

    //* Método para retornar, de forma páginada, la lista de todas los proveedores registrados
    //Para poder validar que los datos de la paginación (page, limit) sean validados
    //crearemos un dto para colocar los decoradores correspondientes
    async findAll({
        limit,
        page,
    }: PaginationQueryDto): Promise<PaginationResponseDto<GetSupplierDto[]>> {
        const total = await this.supplierRepository.count();

        //Math.ceil() -> Sirve para redondear hacia arriba, es decir que cando dividamos el total con el
        //límite podemos obtener un decimal asi que para obtener la cantidad de páginas exacto redondeamos.
        const pages = Math.ceil(total / limit);

        //Comprobamos que la página solicitada no sea mayor al número de páginas total calculado
        if (page > pages){
            if (total === 0) throw new BadRequestException('Aun no hay Proveedores');
            throw new HttpException(
                `El número de página ${page} no existe.`,
                HttpStatus.BAD_REQUEST,
            );
        }

        //El skip es la cantidad de registros que debemos saltar para poder tomar registros según el límite establecido
        // (page - 1 * limit) es como decir (2 - 1) * 10 es decir que saltaremos 10 registros para obtener los siguientes
        // 10 registros de la segunda página.
        // Order: Sirve para indicarle el orden de los datos, en este caso se ordenará de acuerdo al campo createAt
        // de forma ASC -> Ascendente
        // Where: Le indicamos una condición, en este caso que el campo isDelete sea false
        const supplierList = await this.supplierRepository.find({
        skip: (page - 1) * limit,
        take: limit,
        order: { create_at: 'ASC' },
        });

        //Mapeamos los registros hacia la clase dto previamente configurada
        const data = supplierList.map((s: Supplier) => plainToInstance(GetSupplierDto, s));

        //Retornamos los datos requeridos en el DTO de respuesta establecido.
        //para saber si la página previa o siguiente existe hacemos el siguiente cálculo
        // nextPage: si la página actual es menor a la cantidad total de páginas y la cantidad total de páginas
        // es mayor a 0 entonces devolveremos la página
        // actual + 1 de lo contrario devolveremos null ya que esa página no existe
        // prevPage: Si la página es mayor a 1 entonces devolveremos la página actual - 1 de lo contrario devolvemos
        // null ya que la página menor a 1 no existe.
        return {
        totalPages: pages,
        actualPage: page,
        nextPage: page < pages && pages > 0 ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        data,
        } as PaginationResponseDto<GetSupplierDto[]>;
    }

    //* Método para encontrar un proveedor (supplier) no eliminado mediante su id(uuid)
    async findOne(id: string): Promise<GetSupplierDto> {
        //Realizamos la busqueda del brand mediante su id en la base de datos
        const findSupplier = await this.supplierRepository.findOne({
        where: { id_supplier: id },
        });

        //En caso de que el supplier no exista, lanzamos un error con el mesaje y código correspondiente
        if (!findSupplier)
        throw new HttpException(
            `El proveedor con el id '${id}' no fue encontrado.`,
            HttpStatus.NOT_FOUND,
        );

        //Si se encontró el supplier retornamos lo encontrado
        return plainToInstance(GetSupplierDto, findSupplier);
    }

    //* Método para actualizar un proveedor (supplier) mediante su id(uuid)
    async update(
        id: string,
        updateSupplierDto: UpdateSupplierDto,
    ): Promise<GetSupplierDto> {
        //Obtenemos el supplier que deseamos actualizar
        const supplierToUpdate = await this.supplierRepository.findOne({
        where: { id_supplier: id },
        });
        //Si el supplier no fue encontrado devolveremos un error indicando que este no fue encontrado
        if (!supplierToUpdate)
        throw new HttpException(
            `El proveedor con el '${id} no fue encontrado.'`,
            HttpStatus.NOT_FOUND,
        );

        //Si el supplier fue encontado actualizaremos la info del supplier con el dto
        this.supplierRepository.merge(supplierToUpdate, updateSupplierDto);

        const updatedSupplier = await this.supplierRepository.save(supplierToUpdate);

        //Por último guardamos el supplier y retornamos la info actualizada
        return plainToInstance(GetSupplierDto, updatedSupplier);
    }

    //* Método para eliminar de forma lógica un proveedor (supplier)
    async remove(id: string) {
        //Buscamos el supplier que queramos eliminar mediante su id
        const supplierToRemove = await this.supplierRepository.findOne({
        where: { id_supplier: id },
        });

        // Si el supplier no fue encontrado o su propiedad isDelete es true devolvemos un error
        if (!supplierToRemove)
        throw new HttpException(
            `El proveedor con el id '${id} no fue encontrada.'`,
            HttpStatus.NOT_FOUND,
        );
        //En caso no cumpla con las condiciones anteriores actualizamos la propiedad isDelete a true
        await this.supplierRepository.softDelete(id);
        //Por último guardamos y retornamos la data
        return plainToInstance(GetSupplierDto, supplierToRemove);
  }
}