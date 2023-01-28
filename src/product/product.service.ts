import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../model/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Brand } from '../model/brand.entity';
import { PaginationQueryDto } from '../utils/paginate/dto/pagination-query.dto';
import { plainToInstance } from 'class-transformer';
import { GetProductDto } from './dto/get-product.dto';
import { PaginationResponseDto } from '../utils/paginate/dto/pagination-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService{

    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(Brand) private brandRepository: Repository<Brand>
    ){}

    //*Método para crear un producto (product)
    //Recibimos como parámetro el dto con los datos correspondientes y validados
    async create(createProductDto: CreateProductDto): Promise<Product> {
        //se procede a buscar si la marca existe
        const brandexist = await this.brandRepository.findOne({
            where: { name: createProductDto.brand },
        });
        
        //se va crear el codigo sku con el metodo generateSKU
        createProductDto.sku = this.generateSKU(createProductDto.brand, createProductDto.category, 
            createProductDto.color, createProductDto.size, createProductDto.name, createProductDto.gender);

        //se procede a comprobar si el sku ya existe
        const skuexist = await this.productRepository.findOne({
            where: { sku: createProductDto.sku },
        }); 

        //si la marca no existe dara un error
        if (!brandexist)
        throw new HttpException(
            `The brand '${createProductDto.brand}' does not exist`,
             HttpStatus.CONFLICT,
        );

        //si el sku ya existe dara un error
        if (skuexist)
        throw new HttpException(
           `The product with sku '${createProductDto.sku}' alredy exist`,
            HttpStatus.CONFLICT,
        );

        //si el stock resulta ser 0, el estado pasaria a ser Desabilitado
        if(createProductDto.stock==0){
          createProductDto.stale= 'Desabilitado'
        }

        //el nombre de la marca se cambiara por el id de la marca
        createProductDto.brand = brandexist.id_brand;
        //el nombre de la categoria se cambiara por el id de la categoria
        createProductDto.category = `aqui va el idcategory - '${createProductDto.category}'`;

        //por ultimo ya se crea el producto y se guarda en la database
        const createProduct = await this.productRepository.save(createProductDto);
        //Retornamos los datos del producto registrado hacia el cliente
        return createProduct;
    }

    //metodo para autogenerar un sku dependiendo de las propiedades
    private generateSKU(brand: string, category: string, color: string, size: string, name: string, gender: string): string {
        let result = "CMG" + "-" + brand.substring(0,3) + "-" + category.substring(0,3) + "-" + color.substring(0,3) + "-" + size.substring(0,3)
        +  "-" + size.substring(size.length-3) + "-" + name.substring(0,3) + "-" + name.substring(name.length-3) + "-" + gender.substring(0,3); 
        return result;
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
            if (total === 0) throw new BadRequestException('Aun no hay Categorías');
            throw new BadRequestException(`El número de página ${page} no existe`);
          }
        //El skip es la cantidad de registros que debemos saltar para poder tomar registros según el límite establecido
        // (page - 1 * limit) es como decir (2 - 1) * 10 es decir que saltaremos 10 registros para obtener los siguientes
        // 10 registros de la segunda página.
        // Order: Sirve para indicarle el orden de los datos, en este caso se ordenará de acuerdo al campo createAt
        // de forma ASC -> Ascendente
        // Where: Le indicamos una condición, en este caso que el campo isDelete sea false
        const ProductList = await this.productRepository.find({
            skip: (page - 1) * limit,
            take: limit,
            where: {
              isDelete: false,
            },
          });

        //Mapeamos los registros hacia la clase dto previamente configurada
        const productdata = ProductList.map((p: Product) => plainToInstance(GetProductDto, p));    
        //Retornamos los datos requeridos en el DTO de respuesta establecido.
        //para saber si la página previa o siguiente existe hacemos el siguiente cálculo
        // nextPage: si la página actual es menor a la cantidad total de páginas y la cantidad total de páginas
        // es mayor a 0 entonces devolveremos la página
        // actual + 1 de lo contrario devolveremos null ya que esa página no existe
        // prevPage: Si la página es mayor a 1 entonces devolveremos la página actual - 1 de lo contrario devolvemos
        // null ya que la página menor a 1 no existe.
        const data: PaginationResponseDto<GetProductDto[]> = {
            totalPages: pages,
            actualPage: page,
            nextPage: page < pages && pages > 0 ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            data: productdata,
          };
      
          return data;
    }

      //* Método para encontrar un producto (product) no eliminado mediante su id(uuid)
    async findOne(id: string): Promise<GetProductDto> {
        //Realizamos la busqueda del brand mediante su id en la base de datos
        const findProduct = await this.productRepository.findOne({
          where: { id_product: id, isDelete: false },
        });

        //En caso de que el producto no exista, lanzamos un error con el mesaje y código correspondiente
        if (!findProduct)
           throw new HttpException(
          `Product with id '${id}' not found`,
            HttpStatus.NOT_FOUND,
        );
        
        //Si se encontró el brand retornamos lo encontrado
        const data = plainToInstance(GetProductDto, findProduct);

        return data;

    }
    //* Método para actualizar una marca de producto (brand) mediante su id(uuid)
    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
      //Obtenemos el producto que deseamos actualizar
      const productToUpdate = await this.productRepository.findOne({
        where: { id_product: id, isDelete: false },
      });
      //Si el producto no fue encontrado devolveremos un error indicando que este no fue encontrado
      if (!productToUpdate)
        throw new HttpException(
          `Product with id '${id} not found'`,
          HttpStatus.NOT_FOUND,
        );

      //en caso de que el stock sea 0, el producto de deshabilitara
      if(updateProductDto.stock==0)
      {
        updateProductDto.stale='Desabilitado'
      }
  
       //se procede a buscar si la marca existe
       const brandexist = await this.brandRepository.findOne({
        where: { name: updateProductDto.brand },
    });
    
    //se va a actualizar el codigo sku con el metodo generateSKU
    updateProductDto.sku = this.generateSKU(updateProductDto.brand, updateProductDto.category, 
        updateProductDto.color, updateProductDto.size, updateProductDto.name, updateProductDto.gender);

    //se procede a comprobar si el sku ya existe
    const skuexist = await this.productRepository.findOne({
        where: { sku: updateProductDto.sku },
    }); 

    //si la marca no existe dara un error
    if (!brandexist)
    throw new HttpException(
        `The brand '${updateProductDto.brand}' does not exist`,
         HttpStatus.CONFLICT,
    );

    //si el sku ya existe dara un error
    if (skuexist && skuexist.id_product!=productToUpdate.id_product)
    throw new HttpException(
       `The product with sku '${updateProductDto.sku}' alredy exist`,
        HttpStatus.CONFLICT,
    );

    if(updateProductDto.stock==0){
      updateProductDto.stale= 'Desabilitado'
    }

    //el nombre de la marca se cambiara por el id de la marca
    updateProductDto.brand = brandexist.id_brand;
    //el nombre de la categoria se cambiara por el id de la categoria
    updateProductDto.category = `aqui va el idcategory - '${updateProductDto.category}'`;
      //Si el producto fue encontado y lo demas validado actualizaremos la info del brand con el dto
      this.productRepository.merge(productToUpdate, updateProductDto);
  
      //Por último guardamos el producto y retornamos la info actualizada
      return await this.productRepository.save(productToUpdate);
    }

    //* Método para eliminar de forma lógica un producto (priduct)
    async remove(id: string) {
      //Buscamos el brand que queramos eliminar mediante su id
      const productToRemove = await this.productRepository.findOne({
        where: { id_product: id, isDelete: false },
      });
  
      // Si el producto no fue encontrado o su propiedad isDelete es true devolvemos un error
      if (!productToRemove || productToRemove.isDelete)
        throw new HttpException(
          `The product with id '${id} not found or has it already been removed'`,
          HttpStatus.NOT_FOUND,
        );
      //En caso no cumpla con las condiciones anteriores actualizamos la propiedad isDelete a true
      productToRemove.isDelete = true;
      //Por último guardamos y retornamos la data
      return await this.productRepository.save(productToRemove);
    }
}