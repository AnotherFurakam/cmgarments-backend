import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../model/brand.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { GetBrandDto } from './dto/get-brand.dto';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from '../utils/paginate/dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
  ) {}

  //*Método para crear una marca de producto (brand)
  //Recibimos como parámetro el dto con los datos correspondientes y validados
  async create(createBrandDto: CreateBrandDto): Promise<GetBrandDto> {
    try {
      //Si el brand no fue registrado se procederá a guardar en la base de datos
      const createBrand = await this.brandRepository.save(createBrandDto);

      //Retornamos los datos del brand registrado hacia el cliente
      return plainToInstance(GetBrandDto, createBrand);
    } catch (error) {
      //Duplicate constraint
      if (error.code === '23505')
        //El código de estado a utilizar sera el CONFLIC -> para indicar conflictos al registrar
        //Si el nombre del brand ya fue registrado lanzamos un error que diga que ya fue registrado
        throw new ConflictException(
          `La marca con el nombre '${createBrandDto.name}' ya existe.`,
        );
    }
  }

  //* Método para retornar, de forma páginada, la lista de todas las marcas registradas
  //Para poder validar que los datos de la paginación (page, limit) sean validados
  //crearemos un dto para colocar los decoradores correspondientes
  async findAll({
    limit,
    page,
  }: PaginationQueryDto): Promise<PaginationResponseDto<GetBrandDto[]>> {
    const total = await this.brandRepository.count();

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
    const brandList = await this.brandRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createAt: 'ASC' },
    });

    //Mapeamos los registros hacia la clase dto previamente configurada
    const data = brandList.map((b: Brand) => plainToInstance(GetBrandDto, b));

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
    } as PaginationResponseDto<GetBrandDto[]>;
  }

  //* Método para encontrar una marca de producto (brand) no eliminado mediante su id(uuid)
  async findOne(id: string): Promise<GetBrandDto> {
    //Realizamos la busqueda del brand mediante su id en la base de datos
    const findBrand = await this.brandRepository.findOne({
      where: { id_brand: id },
    });

    //En caso de que el brand no exista, lanzamos un error con el mesaje y código correspondiente
    if (!findBrand)
      throw new HttpException(
        `La marca con el id '${id}' no fue encontrada.`,
        HttpStatus.NOT_FOUND,
      );

    //Si se encontró el brand retornamos lo encontrado
    return plainToInstance(GetBrandDto, findBrand);
  }

  //* Método para actualizar una marca de producto (brand) mediante su id(uuid)
  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<GetBrandDto> {
    //Obtenemos el brand que deseamos actualizar
    const brandToUpdate = await this.brandRepository.findOne({
      where: { id_brand: id },
    });
    //Si el brand no fue encontrado devolveremos un error indicando que este no fue encontrado
    if (!brandToUpdate)
      throw new HttpException(
        `La marca con el '${id} no fue econtrada.'`,
        HttpStatus.NOT_FOUND,
      );

    //Si el brand fue encontado actualizaremos la info del brand con el dto
    this.brandRepository.merge(brandToUpdate, updateBrandDto);

    const updatedBrand = await this.brandRepository.save(brandToUpdate);

    //Por último guardamos el brand y retornamos la info actualizada
    return plainToInstance(GetBrandDto, updatedBrand);
  }

  //* Método para eliminar de forma lógica una marca de producto (brand)
  async remove(id: string) {
    //Buscamos el brand que queramos eliminar mediante su id
    const brandToRemove = await this.brandRepository.findOne({
      where: { id_brand: id },
    });

    // Si el brando no fue encontrado o su propiedad isDelete es true devolvemos un error
    if (!brandToRemove)
      throw new HttpException(
        `La marca con el id '${id} no fue encontrada.'`,
        HttpStatus.NOT_FOUND,
      );
    //En caso no cumpla con las condiciones anteriores actualizamos la propiedad isDelete a true
    await this.brandRepository.softDelete(id);
    //Por último guardamos y retornamos la data
    return plainToInstance(GetBrandDto, brandToRemove);
  }
}
