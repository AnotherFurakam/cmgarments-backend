import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Product } from "src/model/product.entity";
import { ProductSupplier } from "src/model/productsupplier.entity";
import { Supplier } from "src/model/supplier.entity";
import { ProductService } from "src/product/product.service";
import { PaginationQueryDto, PaginationResponseDto } from "src/utils/paginate/dto";
import { Repository } from "typeorm";
import { CreateProductSupplierDto } from "./dto/create-productsupplier.dto";
import { GetProductSupplierDto } from "./dto/get-productsupplier.dto";
import { UpdateProductSupplierDto } from "./dto/update-productsupplier.dto";

@Injectable()
export class ProductSupplierService {
    constructor(
        @InjectRepository(ProductSupplier) private productsupplierRepository: Repository<ProductSupplier>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>,
    ){}

    //*Método para crear un producto (product)
    //Recibimos como parámetro el dto con los datos correspondientes y validados
    async create(createProductSupplierDto: CreateProductSupplierDto): Promise<GetProductSupplierDto> {
        //se procede a buscar si el producto existe
        const ProductExist = await this.productRepository.findOne({
        where: { id_product: createProductSupplierDto.id_product },
        });

        //se procede a buscar si el proveedor existe
        const SupplierExist = await this.supplierRepository.findOne({
        where: { id_supplier: createProductSupplierDto.id_supplier },
        });

        //si la marca no existe dara un error
        if (!ProductExist)
        throw new HttpException(
            `El productos '${createProductSupplierDto.id_product}' no existe`,
            HttpStatus.CONFLICT,
        );

        //si la categoria no existe dara un error
        if (!SupplierExist)
        throw new HttpException(
            `El proveedor '${createProductSupplierDto.id_supplier}' no existe`,
            HttpStatus.CONFLICT,
        );

        //ya se crea el producto y se guarda en la database
        const productsupplierToRegist = this.productsupplierRepository.create(createProductSupplierDto);
        //guardamos los objetos con respecto al uid del brand
        productsupplierToRegist.product = ProductExist;
        //guardamos los objetos con respecto al uid del category
        productsupplierToRegist.supplier = SupplierExist;
        const createProductSupplier = await this.productsupplierRepository.save(productsupplierToRegist);

        //Retornamos los datos del producto registrado hacia el cliente
        return plainToInstance(GetProductSupplierDto, createProductSupplier);
    }

    //? Obtener todas los Productos (GET)
    // limit -> cantidad de Productos
    // page -> página que desea
    async findAll({ limit, page }: PaginationQueryDto) {
        // obtener total y páginas de Productos
        const total = await this.productRepository.count();
        const pages = Math.ceil(total / limit);

        // verificar que la página solicitada no sea mayor a las páginas totales
        if (page > pages) {
        if (total === 0) throw new BadRequestException('Aun no hay Productos/Proveedores');
        throw new BadRequestException(`El número de página ${page} no existe`);
        }
        //El skip es la cantidad de registros que debemos saltar para poder tomar registros según el límite establecido
        // (page - 1 * limit) es como decir (2 - 1) * 10 es decir que saltaremos 10 registros para obtener los siguientes
        // 10 registros de la segunda página.
        // Order: Sirve para indicarle el orden de los datos, en este caso se ordenará de acuerdo al campo createAt
        // de forma ASC -> Ascendente
        // Where: Le indicamos una condición, en este caso que el campo delete_at sea null
        const ProductSupplierList = await this.productsupplierRepository.find({
        relations: ['product', 'supplier'],
        skip: (page - 1) * limit,
        take: limit,
        order: { create_at: 'ASC' },
        where: {
            delete_at: null,
        },
        });

        //Mapeamos los registros hacia la clase dto previamente configurada
            const productsupplierdata = ProductSupplierList.map((ps: ProductSupplier) =>
            plainToInstance(GetProductSupplierDto, ps),
        );
        //Retornamos los datos requeridos en el DTO de respuesta establecido.
        //para saber si la página previa o siguiente existe hacemos el siguiente cálculo
        // nextPage: si la página actual es menor a la cantidad total de páginas y la cantidad total de páginas
        // es mayor a 0 entonces devolveremos la página
        // actual + 1 de lo contrario devolveremos null ya que esa página no existe
        // prevPage: Si la página es mayor a 1 entonces devolveremos la página actual - 1 de lo contrario devolvemos
        // null ya que la página menor a 1 no existe.
        const data: PaginationResponseDto<GetProductSupplierDto[]> = {
            totalPages: pages,
            actualPage: page,
            nextPage: page < pages && pages > 0 ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            data: productsupplierdata,
        };

        return data;
    }

    //* Método para encontrar un producto (product) no eliminado mediante su id(uuid)
    async findOne(id: string): Promise<GetProductSupplierDto> {
        //Realizamos la busqueda del brand mediante su id en la base de datos
        const findProductSupplier = await this.productsupplierRepository.findOne({
            relations: ['product', 'supplier'],
            where: { id_productsupplier: id, delete_at: null },
        });

        //En caso de que el producto no exista, lanzamos un error con el mesaje y código correspondiente
        if (!findProductSupplier)
        throw new HttpException(
            `El producto con el id '${id}' no fue encontrado`,
            HttpStatus.NOT_FOUND,
        );

        //Si se encontró el brand retornamos lo encontrado
        const data = plainToInstance(GetProductSupplierDto, findProductSupplier);

        return data;
    }

    //* Método para actualizar una marca de producto (brand) mediante su id(uuid)
    async update(
        id: string,
        updateProductSupplierDto: UpdateProductSupplierDto,
    ): Promise<GetProductSupplierDto> {
        //Obtenemos el producto que deseamos actualizar
        const productSupplierToUpdate = await this.productsupplierRepository.findOne({
            relations: ['product', 'supplier'],
            where: { id_productsupplier: id, delete_at: null },
        });
        //Si el producto no fue encontrado devolveremos un error indicando que este no fue encontrado
        if (!productSupplierToUpdate)
        throw new HttpException(
            `El producto con el id '${id} no fue encontrado.'`,
            HttpStatus.NOT_FOUND,
        );

        //se procede a buscar si el producto existe
        const ProductExist = await this.productRepository.findOne({
        where: { id_product: updateProductSupplierDto.id_product },
        });

        //se procede a buscar si el proveedor existe
        const SupplierExist = await this.supplierRepository.findOne({
        where: { id_supplier: updateProductSupplierDto.id_supplier },
        });

        //si la marca no existe dara un error
        if (!ProductExist)
        throw new HttpException(
            `El productos '${updateProductSupplierDto.id_product}' no existe`,
            HttpStatus.CONFLICT,
        );

        //si la categoria no existe dara un error
        if (!SupplierExist)
        throw new HttpException(
            `El proveedor '${updateProductSupplierDto.id_supplier}' no existe`,
            HttpStatus.CONFLICT,
        );

        //Si el producto fue encontado y lo demas validado actualizaremos la info del product con el dto
        const productSupplierUpdate = this.productsupplierRepository.merge(
        productSupplierToUpdate,
        updateProductSupplierDto,
        );
        productSupplierUpdate.product = ProductExist;
        productSupplierUpdate.supplier = SupplierExist;
        const updatedProductSupplier = await this.productsupplierRepository.save(productSupplierUpdate);
        //por ultimo buscamos el producto recien actualizado

        //Retornamos los datos del producto actualizado hacia el cliente
        return plainToInstance(GetProductSupplierDto, updatedProductSupplier);
    }

    //* Método para eliminar de forma lógica un producto (priduct)
    async remove(id: string) {
        //Buscamos el brand que queramos eliminar mediante su id
        const productSupplierToRemove = await this.productsupplierRepository.findOne({
            relations: ['product', 'supplier'],
            where: { id_productsupplier: id },
        });

        // Si el producto no fue encontrado o su propiedad delete_at no es null devolvemos un error
        if (!productSupplierToRemove || productSupplierToRemove.delete_at != null)
        throw new HttpException(
            `El producto con el id '${id} no fue encontrado o ya fue removido.'`,
            HttpStatus.NOT_FOUND,
        );
        await this.productsupplierRepository.softDelete(id);
        //Retornamos los datos del producto registrado hacia el cliente
        return plainToInstance(GetProductSupplierDto, productSupplierToRemove);
    }
}