import { ConflictException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Entrance } from "src/model/entrance.entity";
import { Product } from "src/model/product.entity";
import { Supplier } from "src/model/supplier.entity";
import { PaginationQueryDto, PaginationResponseDto } from "src/utils/paginate/dto";
import { Repository } from "typeorm";
import { CreateEntranceDto } from "./dto/create.entrance.dto";
import { GetEntranceDto } from "./dto/get.entrance.dto";
import { UpdateEntranceDto } from "./dto/update.entrance.dto";

@Injectable()
export class EntranceService {
    constructor(
        @InjectRepository(Entrance) private entranceRepository: Repository<Entrance>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>,
      ) {}

    //*Método para crear una Entrada (entrance)
    //Recibimos como parámetro el dto con los datos correspondientes y validados
    async create(createEntranceDto: CreateEntranceDto): Promise<GetEntranceDto> {
        
        //se procede a buscar si el product existe
        const productExist = await this.productRepository.findOne({
            where: { id_product: createEntranceDto.id_product },
        });

        //se procede a buscar si el supplier existe
        const supplierExist = await this.supplierRepository.findOne({
            where: { id_supplier: createEntranceDto.id_supplier },
        });

        //si el producto no existe dara un error
        if (!productExist)
        throw new HttpException(
            `El producto '${createEntranceDto.id_product}' no existe`,
            HttpStatus.CONFLICT,
        );

        //si el proveedor no existe dara un error
        if (!supplierExist)
        throw new HttpException(
            `El proveedor '${createEntranceDto.id_supplier}' no existe`,
            HttpStatus.CONFLICT,
        );

        productExist.stock = productExist.stock + createEntranceDto.units;  
        await this.productRepository.save(productExist);

        //ya se crea la entrada y se guarda en la database
        const entranceToRegist = this.entranceRepository.create(createEntranceDto);
        //guardamos los objetos con respecto al uid del producto
        entranceToRegist.product = productExist;
        //guardamos los objetos con respecto al uid del proveedor
        entranceToRegist.supplier = supplierExist;
        const createEntrance = await this.entranceRepository.save(entranceToRegist);

        //Retornamos los datos del supplier registrado hacia el cliente
        return plainToInstance(GetEntranceDto, createEntrance);

    }

    //* Método para retornar, de forma páginada, la lista de todas los proveedores registrados
    //Para poder validar que los datos de la paginación (page, limit) sean validados
    //crearemos un dto para colocar los decoradores correspondientes
    async findAll({
        limit,
        page,
    }: PaginationQueryDto): Promise<PaginationResponseDto<GetEntranceDto[]>> {
        const total = await this.entranceRepository.count();

        //Math.ceil() -> Sirve para redondear hacia arriba, es decir que cando dividamos el total con el
        //límite podemos obtener un decimal asi que para obtener la cantidad de páginas exacto redondeamos.
        const pages = Math.ceil(total / limit);

        //Comprobamos que la página solicitada no sea mayor al número de páginas total calculado
        if (page > pages)
        throw new HttpException(
            `El número de página ${page} no existe.`,
            HttpStatus.BAD_REQUEST,
        );

        //El skip es la cantidad de registros que debemos saltar para poder tomar registros según el límite establecido
        // (page - 1 * limit) es como decir (2 - 1) * 10 es decir que saltaremos 10 registros para obtener los siguientes
        // 10 registros de la segunda página.
        // Order: Sirve para indicarle el orden de los datos, en este caso se ordenará de acuerdo al campo createAt
        // de forma ASC -> Ascendente
        // Where: Le indicamos una condición, en este caso que el campo isDelete sea false
        const entranceList = await this.entranceRepository.find({
            relations: ['product', 'supplier'],  
            skip: (page - 1) * limit,
            take: limit,
            order: { create_at: 'ASC' },
            where: {
                delete_at: null,
            },
        });

        //Mapeamos los registros hacia la clase dto previamente configurada
        const data = entranceList.map((e: Entrance) => plainToInstance(GetEntranceDto, e));

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
        } as PaginationResponseDto<GetEntranceDto[]>;
    }

    //* Método para encontrar un proveedor (supplier) no eliminado mediante su id(uuid)
    async findOne(id: string): Promise<GetEntranceDto> {
        //Realizamos la busqueda del brand mediante su id en la base de datos
        const findEntrance = await this.entranceRepository.findOne({
            relations: ['product', 'supplier'],  
            where: { id_entrance: id, delete_at: null},
        });

        //En caso de que el supplier no exista, lanzamos un error con el mesaje y código correspondiente
        if (!findEntrance)
        throw new HttpException(
            `La Entrada con el id '${id}' no fue encontrado.`,
            HttpStatus.NOT_FOUND,
        );

        //Si se encontró el supplier retornamos lo encontrado
        return plainToInstance(GetEntranceDto, findEntrance);
    }

    //* Método para actualizar un proveedor (supplier) mediante su id(uuid)
    async update(
        id: string,
        updateEntranceDto: UpdateEntranceDto,
    ): Promise<GetEntranceDto> {
        //Obtenemos el supplier que deseamos actualizar
        const entranceToUpdate = await this.entranceRepository.findOne({
            relations: ['product', 'supplier'],
            where: { id_entrance: id, delete_at: null }, 
        });
        //Si el supplier no fue encontrado devolveremos un error indicando que este no fue encontrado
        if (!entranceToUpdate)
        throw new HttpException(
            `La entrada con el '${id} no fue encontrado.'`,
            HttpStatus.NOT_FOUND,
        );

        //se procede a buscar si la marca existe
        const productExist = await this.productRepository.findOne({
            where: { id_product: updateEntranceDto.id_product },
        });

        //se procede a buscar si la marca existe
        const supplierExist = await this.supplierRepository.findOne({
            where: { id_supplier: updateEntranceDto.id_supplier },
        });

        //si la marca no existe dara un error
        if (!productExist)
        throw new HttpException(
            `El producto'${updateEntranceDto.id_product}' no existe`,
            HttpStatus.CONFLICT,
        );

        //si la marca no existe dara un error
        if (!supplierExist)
        throw new HttpException(
            `El proveedor '${updateEntranceDto.id_supplier}' no existe`,
            HttpStatus.CONFLICT,
        );

        productExist.stock = productExist.stock - entranceToUpdate.units + updateEntranceDto.units;  
        await this.productRepository.save(productExist);

        //Si el supplier fue encontado actualizaremos la info del supplier con el dto
        const entranceUpdate = this.entranceRepository.merge(entranceToUpdate, updateEntranceDto);
        entranceUpdate.product = productExist;
        entranceUpdate.supplier = supplierExist;
        const updatedEntrance = await this.entranceRepository.save(entranceUpdate);

        //Por último guardamos el supplier y retornamos la info actualizada
        return plainToInstance(GetEntranceDto, updatedEntrance);
    }
    //* Método para eliminar de forma lógica un producto (priduct)
    async remove(id: string) {
        //Buscamos el brand que queramos eliminar mediante su id
        const entranceToRemove = await this.entranceRepository.findOne({
            relations: ['product', 'supplier'],
            where: { id_entrance: id, delete_at: null }, 
        });

        const productExist = await this.productRepository.findOne({
            where: { id_product: entranceToRemove.product.id_product },
        });

        if (!productExist)
        throw new HttpException(
            `El producto'${entranceToRemove.product.id_product}' no existe`,
            HttpStatus.CONFLICT,
        );

        productExist.stock = productExist.stock - entranceToRemove.units; 
        await this.productRepository.save(productExist);

        // Si el producto no fue encontrado o su propiedad delete_at no es null devolvemos un error
        if (!entranceToRemove || entranceToRemove.delete_at != null)
        throw new HttpException(
            `La Entrada con el id '${id} no fue encontrado o ya fue removido.'`,
            HttpStatus.NOT_FOUND,
        );
        await this.entranceRepository.softDelete(id);
        //Retornamos los datos del producto registrado hacia el cliente
        return plainToInstance(GetEntranceDto, entranceToRemove);
    }
}