import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from '../model/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Brand } from '../model/brand.entity';
import { PaginationQueryDto } from '../utils/paginate/dto/pagination-query.dto';
import { plainToInstance } from 'class-transformer';
import { GetProductDto } from './dto/get-product.dto';
import { PaginationResponseDto } from '../utils/paginate/dto/pagination-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { generateSKU } from 'src/utils/sku/generate-sku';
import { Category } from '../model/category.entity';
import { Image } from '../model/image.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateImageDto } from './dto/image/create-image.dto';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { ImageDto } from './dto/image/image.dto';
import { ResponseImageProductDto } from './dto/image/response-image-product.dto';
import { imageFormat } from '../utils/image';
import { ResponseImageDto } from './dto/image/response-image.dto';
import { ResponseCountDto } from '../utils/dto/response-count.dto';
import { SearchByEnum } from './dto/search-by.enum';
import { SearchDto } from './dto/search.dto';
import { FilterByDateDto } from './dto/filtro-by-fecha.dto';
import { ProductImageDto } from './product-image-response.dto';
import { GetProductByIdBrandDto } from './dto/get-product-brand.dto';
import { GetProductByIdCategoryDto } from './dto/get-product-category.dto';
import { GetRelationSizes } from './dto/get-relation-sizes.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  //*Método para crear un producto (product)
  //Recibimos como parámetro el dto con los datos correspondientes y validados
  async create(createProductDto: CreateProductDto): Promise<GetProductDto> {
    //se procede a buscar si la marca existe
    const brandExist = await this.brandRepository.findOne({
      where: { id_brand: createProductDto.id_brand },
    });

    //se procede a buscar si la categoria existe
    const categoryExist = await this.categoryRepository.findOne({
      where: { id_category: createProductDto.id_category },
    });

    //se va crear el codigo sku con el metodo generateSKU
    const skugenerate = generateSKU(
      createProductDto.id_brand,
      createProductDto.id_category,
      createProductDto.color,
      createProductDto.size,
      createProductDto.name,
      createProductDto.gender,
    );

    //se procede a comprobar si el sku ya existe
    const skuExist = await this.productRepository.findOne({
      where: { sku: skugenerate },
    });

    //se procede a comprobar si el producto y la talla ya existe
    const prodSizeExist = await this.productRepository.findOne({
      where: { name: createProductDto.name, size: createProductDto.size}
    });

    //si la marca no existe dara un error
    if (!brandExist)
      throw new HttpException(
        `La marca '${createProductDto.id_brand}' no existe`,
        HttpStatus.CONFLICT,
      );

    //si la categoria no existe dara un error
    if (!categoryExist)
      throw new HttpException(
        `La categoria '${createProductDto.id_category}' no existe`,
        HttpStatus.CONFLICT,
      );

        // si el producto y la talla ya existe dara un error
    if (prodSizeExist)
    throw new HttpException(
      `El producto con el nombre y talla '${createProductDto.name}', '${createProductDto.size}' ya existe.`,
      HttpStatus.CONFLICT,
    );

    //si el sku ya existe dara un error
    if (skuExist)
      throw new HttpException(
        `El producto con el sku '${skugenerate}' ya existe.`,
        HttpStatus.CONFLICT,
      );

    //si el stock resulta ser 0, el estado pasaria a ser Desabilitado
    if (createProductDto.stock == 0) {
      createProductDto.state = false;
    }

    //ya se crea el producto y se guarda en la database
    const productToRegist = this.productRepository.create(createProductDto);
    productToRegist.sku = skugenerate;
    //guardamos los objetos con respecto al uid del brand
    productToRegist.brand = brandExist;
    //guardamos los objetos con respecto al uid del category
    productToRegist.category = categoryExist;
    const createProduct = await this.productRepository.save(productToRegist);

    //Retornamos los datos del producto registrado hacia el cliente
    return plainToInstance(GetProductDto, createProduct);
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
      if (total === 0) throw new BadRequestException('Aun no hay Productos');
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
    // Where: Le indicamos una condición, en este caso que el campo delete_at sea null
    const ProductList = await this.productRepository.find({
      relations: ['brand', 'category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { create_at: 'ASC' },
      where: {
        delete_at: null,
      },
    });

    //Mapeamos los registros hacia la clase dto previamente configurada
    const productdata = ProductList.map((p: Product) =>
      plainToInstance(GetProductDto, p),
    );
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

  async findRelationSizes(id: string): Promise<GetRelationSizes>{

    //Realizamos la busqueda del brand mediante su id en la base de datos
    const findProduct = await this.productRepository.findOne({
      relations: ['brand', 'category'],
      where: { id_product: id, delete_at: null },
    });

    if (!findProduct)
      throw new HttpException(
        `El producto con el id '${id}' no fue encontrado`,
        HttpStatus.NOT_FOUND,
      );

    //se procede a buscar las tallas relaciondas
    const relatedSizes = await this.productRepository.find({
      relations: ['brand', 'category'],
      where: { name: findProduct.name}
    });
    
    const relation_size = relatedSizes.map(p => p.size);

    const response = new GetRelationSizes(relation_size);

    return response

  }
  
  async findNameSize(id: string, size: string): Promise<GetProductDto>{
    //Realizamos la busqueda del brand mediante su id en la base de datos
    const findProduct = await this.productRepository.findOne({
      relations: ['brand', 'category'],
      where: { id_product: id, delete_at: null },
    });

    if (!findProduct)
      throw new HttpException(
        `El producto con el id '${id}' no fue encontrado`,
        HttpStatus.NOT_FOUND,
      );

    const findNameSize = await this.productRepository.findOne({
      relations: ['brand', 'category'],
      where: { name: findProduct.name, delete_at: null , size: size},
    });

    if (!findNameSize)
      throw new HttpException(
        `El producto '${findProduct.name}' con la talla '${size}' no fue encontrado`,
        HttpStatus.NOT_FOUND,
      );
    
    const data = plainToInstance(GetProductDto, findNameSize)

    return data
  }

  //* Método para encontrar un producto (product) no eliminado mediante su id(uuid)
  async findOne(id: string): Promise<GetProductDto> {
    //Realizamos la busqueda del brand mediante su id en la base de datos
    const findProduct = await this.productRepository.findOne({
      relations: ['brand', 'category'],
      where: { id_product: id, delete_at: null },
    });

    //En caso de que el producto no exista, lanzamos un error con el mesaje y código correspondiente
    if (!findProduct)
      throw new HttpException(
        `El producto con el id '${id}' no fue encontrado`,
        HttpStatus.NOT_FOUND,
      );

    //Si se encontró el brand retornamos lo encontrado
    const data = plainToInstance(GetProductDto, findProduct);

    return data;
  }
  //* Método para actualizar una marca de producto (brand) mediante su id(uuid)
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<GetProductDto> {
    //Obtenemos el producto que deseamos actualizar
    const productToUpdate = await this.productRepository.findOne({
      relations: ['brand', 'category'],
      where: { id_product: id, delete_at: null },
    });
    //Si el producto no fue encontrado devolveremos un error indicando que este no fue encontrado
    if (!productToUpdate)
      throw new HttpException(
        `El producto con el id '${id} no fue encontrado.'`,
        HttpStatus.NOT_FOUND,
      );

      //se procede a comprobar si el producto y la talla ya existe
    const prodSizeExist = await this.productRepository.findOne({
      where: { name: updateProductDto.name, size: updateProductDto.size}
    });

    if (prodSizeExist)
    throw new HttpException(
      `El producto con el nombre y talla '${updateProductDto.name}', '${updateProductDto.size}' ya existe.`,
      HttpStatus.CONFLICT,
    );

    //en caso de que el stock sea 0, el producto de deshabilitara
    if (updateProductDto.stock == 0) {
      updateProductDto.state = false;
    }

    //se procede a buscar si la marca existe
    const brandExist = await this.brandRepository.findOne({
      where: { id_brand: updateProductDto.id_brand },
    });

    //se procede a buscar si la categoria existe
    const categoryExist = await this.categoryRepository.findOne({
      where: { id_category: updateProductDto.id_category },
    });

    //se va a actualizar el codigo sku con el metodo generateSKU
    const skugenerate = generateSKU(
      updateProductDto.id_brand,
      updateProductDto.id_category,
      updateProductDto.color,
      updateProductDto.size,
      updateProductDto.name,
      updateProductDto.gender,
    );

    //se procede a comprobar si el sku ya existe
    const skuExist = await this.productRepository.findOne({
      where: { sku: skugenerate },
    });

    //si la marca no existe dara un error
    if (!brandExist)
      throw new HttpException(
        `La marca '${updateProductDto.id_brand}' no exist`,
        HttpStatus.CONFLICT,
      );

    //si la categoria no existe dara un error
    if (!categoryExist)
      throw new HttpException(
        `La categoria '${updateProductDto.id_category}' no existe`,
        HttpStatus.CONFLICT,
      );

    //si el sku ya existe dara un error
    if (skuExist && skuExist.id_product != productToUpdate.id_product)
      throw new HttpException(
        `El producto con el sku '${skugenerate}' ya existe`,
        HttpStatus.CONFLICT,
      );

    //si el stock resulta ser 0 se desabilitara el producto
    if (updateProductDto.stock == 0) {
      updateProductDto.state = false;
    }
    //actualizamos el sku al generado
    productToUpdate.sku = skugenerate;
    //Si el producto fue encontado y lo demas validado actualizaremos la info del product con el dto
    const productUpdate = this.productRepository.merge(
      productToUpdate,
      updateProductDto,
    );
    productUpdate.brand = brandExist;
    productUpdate.category = categoryExist;
    const updatedProduct = await this.productRepository.save(productUpdate);
    //por ultimo buscamos el producto recien actualizado

    //Retornamos los datos del producto actualizado hacia el cliente
    return plainToInstance(GetProductDto, updatedProduct);
  }

  //* Método para eliminar de forma lógica un producto (priduct)
  async remove(id: string) {
    //Buscamos el brand que queramos eliminar mediante su id
    const productToRemove = await this.productRepository.findOne({
      relations: ['brand', 'category'],
      where: { id_product: id },
    });

    // Si el producto no fue encontrado o su propiedad delete_at no es null devolvemos un error
    if (!productToRemove || productToRemove.delete_at != null)
      throw new HttpException(
        `El producto con el id '${id} no fue encontrado o ya fue removido.'`,
        HttpStatus.NOT_FOUND,
      );
    await this.productRepository.softDelete(id);
    //Retornamos los datos del producto registrado hacia el cliente
    return plainToInstance(GetProductDto, productToRemove);
  }

  //? (POST) - Guardar IMAGEN segun ID de Producto
  //! arreglar la propiedad "main" siempre true
  async saveImage(id: string, createImageDto: CreateImageDto) {
    // obtener producto desde el servicio para q en caso no exista de un error
    const product = await this.findOne(id);

    const { image, title, main } = createImageDto;
    let resImg: UploadApiResponse | UploadApiErrorResponse;

    // verificamos el tipo si es imagen
    if (!imageFormat.includes(image.mimetype))
      throw new BadRequestException('Tipo de archivo invalido');

    //* guardamos la imagen utilizando el sevicio de cloudinary
    try {
      resImg = await this.cloudinaryService.uploadImage(image);
    } catch (e) {
      throw new BadRequestException('Tipo de archivo invalido');
    }

    //* obtenemos la url de la respuesta del guardado de imagen
    const { url } = resImg as UploadApiResponse;
    const imageDto: ImageDto = { title, url, main, id_product: id };

    // creamos, agregamos el producto para q se guarde el id_product y guardamos
    const createImage = this.imageRepository.create(imageDto);
    createImage.product = plainToInstance(Product, product);
    const data = this.imageRepository.save(createImage);

    // limpiamos la data que nos devuelve el guardado
    const dataImage = plainToInstance(ResponseImageProductDto, data);

    return dataImage;
  }

  //? (GET) - Obtener IMAGENES según ID de producto
  async findImages(id: string) {
    // verificar si el producto existe
    await this.findOne(id);

    //* obtener todas las imagenes
    const images = await this.imageRepository.find({
      where: {
        product: {
          id_product: id,
        },
      },
    });

    // limpiar el arreglo de imagenes
    const dataImages = images.map((image) =>
      plainToInstance(ResponseImageDto, image),
    );

    return dataImages;
  }

  //? (DELETE) - Eliminar una IMAGEN por ID
  async removeImage(id: string) {
    // verificar si la imagen existe
    const image = await this.getByImageId(id);

    //* Eliminar Imagen
    const deleteImage = await this.imageRepository.softDelete(id);

    // verificar si se han afectado columnas. Si se elimino la imagen
    if (!deleteImage.affected)
      throw new NotFoundException(`La Imagen con el id "${id}" no existe`);

    // convertimos de tipo "Image" a "ResponseImageDto"
    const data = plainToInstance(ResponseImageDto, image);

    return data;
  }

  //? (GET) - Obtener cantidad de PRODUCTOS
  async getQuantity() {
    const total = await this.productRepository.count();
    const data: ResponseCountDto = { type: 'Productos', total };

    return data;
  }

  //*  Obtener IMAGE por ID (Método)
  private async getByImageId(id: string) {
    // Obtener image por id
    const image = await this.imageRepository.findOne({
      where: { id_image: id },
    });

    // verificar si existe
    if (!image)
      throw new NotFoundException(`La Imagen con el id "${id}" no existe`);

    return image;
  }

  //* Función que realiza la busqueda de un producto mediante su nombre o sku

  /**
   * Retorna los productos encontrados por nombre o sku
   * @param searchDto SearchDto: Contiene el nombre y criterio de busqueda
   * @param paginationQuery PaginationQueryDto -> Página y límite de productos a buscar
   * @returns PaginationResponseDto<GetProductoDto>
   */
  async searchProduct(
    searchDto: SearchDto,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<GetProductDto[]>> {
    const { text, searchBy }: SearchDto = searchDto;
    const { limit, page }: PaginationQueryDto = paginationQuery;
    const total = await this.productRepository.count();
    const pages = Math.ceil(total / limit);

    switch (searchBy) {
      case SearchByEnum.NAME:
        const productListByName = await this.productRepository.find({
          relations: ['brand', 'category'],
          where: {
            name: ILike(`%${text}%`),
          },
          take: limit,
          skip: (page - 1) * limit,
        });

        const productListDtobyName: GetProductDto[] = productListByName.map(
          (p: Product) => plainToInstance(GetProductDto, p),
        );

        return {
          actualPage: page,
          totalPages: pages,
          nextPage: page < pages && pages > 0 ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
          data: productListDtobyName,
        } as PaginationResponseDto<GetProductDto[]>;

      case SearchByEnum.SKU:
        const productListBySku = await this.productRepository.find({
          relations: ['brand', 'category'],
          where: {
            sku: ILike(`${text}%`),
          },
          take: limit,
          skip: (page - 1) * limit,
        });

        const dataBySku: GetProductDto[] = productListBySku.map((p: Product) =>
          plainToInstance(GetProductDto, p),
        );

        return {
          actualPage: page,
          totalPages: pages,
          nextPage: page < pages && pages > 0 ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
          data: dataBySku,
        } as PaginationResponseDto<GetProductDto[]>;
      default:
        throw new BadRequestException(
          'El criterio de busqueda es erroneo, solo puede buscar por nombre o sku',
        );
    }
  }
  //* Función que filtra los productos por fecha

  async filterByDate(
    { dateStart, dateEnd }: FilterByDateDto,
    { limit, page }: PaginationQueryDto,
  ): Promise<PaginationResponseDto<GetProductDto[]>> {
    const total = await this.productRepository.count();
    const pages = Math.ceil(total / limit);

    const productListByDate: Product[] = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category')
      .where(
        `DATE(product.create_at) BETWEEN DATE(:dateStart) AND DATE(:dateEnd)`,
        { dateStart, dateEnd },
      )
      .orderBy('product.create_at', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();

    const dataByDate = productListByDate.map((p) =>
      plainToInstance(GetProductDto, p),
    );

    return {
      actualPage: page,
      totalPages: pages,
      nextPage: page < pages && pages > 0 ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      data: dataByDate,
    } as PaginationResponseDto<GetProductDto[]>;
  }

  //* Función para obtener los productos recientes
  async getRecentsProducts(quantity: number): Promise<ProductImageDto[]> {
    const productos: Product[] = await this.productRepository.find({
      relations: ['images'],
      take: quantity,
      order: {
        create_at: 'DESC',
      },
    });
    return productos.map((p) => plainToInstance(ProductImageDto, p));
  }

  //? (GET) - Obtener productos según ID de la marca
  async findAllByIdBrand(id: string): Promise<GetProductByIdBrandDto[]> {
    const dataList = await this.productRepository.find({
      relations: ['brand', 'category'],
      where: {
        brand: {
          id_brand: id,
        },
      },
    });

    // limpiar el arreglo de imagenes
    const data = dataList.map((p) =>
      plainToInstance(GetProductByIdBrandDto, p),
    );

    return data;
  }

  //? (GET) - Obtener productos según ID de la marca
  async findAllByIdCategory(id: string): Promise<GetProductByIdCategoryDto[]> {
    const dataList = await this.productRepository.find({
      relations: ['brand', 'category'],
      where: {
        category: {
          id_category: id,
        },
      },
    });

    // limpiar el arreglo de imagenes
    const data = dataList.map((p) =>
      plainToInstance(GetProductByIdCategoryDto, p),
    );

    return data;
  }
}
