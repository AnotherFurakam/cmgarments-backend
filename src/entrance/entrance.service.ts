import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Entrance } from 'src/model/entrance.entity';
import { Product } from 'src/model/product.entity';
import { Supplier } from 'src/model/supplier.entity';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/utils/paginate/dto';
import { Repository } from 'typeorm';
import { CreateEntranceDto } from './dto/create.entrance.dto';
import { GetEntranceDto } from './dto/get.entrance.dto';
import { UpdateEntranceDto } from './dto/update.entrance.dto';
import { Purchase_detail } from 'src/model/purchase_detail.entity';

@Injectable()
export class EntranceService {
  constructor(
    @InjectRepository(Entrance)
    private entranceRepository: Repository<Entrance>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Purchase_detail)
    private purDetailRepository: Repository<Purchase_detail>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  //? (POST) Crear Entrada
  async create(createEntranceDto: CreateEntranceDto) {
    //obtener detalle compra
    const purDetailExist = await this.purDetailRepository.findOne({
      relations: ['id_product', 'id_purchase'],
      where: { id_purchase_detail: createEntranceDto.id_purchase_detail },
    });

    if (!purDetailExist)
      throw new HttpException(
        `El detalle '${createEntranceDto.id_purchase_detail}' no existe`,
        HttpStatus.CONFLICT,
      );

    //obtener producto
    const productExist = await this.productRepository.findOne({
      where: { id_product: purDetailExist.id_product.id_product },
    });

    if (!productExist)
      throw new HttpException(
        `El producto '${purDetailExist.id_product.id_product}' no existe`,
        HttpStatus.CONFLICT,
      );

    //ya se crea la entrada y se guarda en la database
    const entranceToRegist = this.entranceRepository.create(createEntranceDto);
    entranceToRegist.purchase_detail = purDetailExist;
    const createEntrance = await this.entranceRepository.save(entranceToRegist);

    purDetailExist.received = true;
    await this.purDetailRepository.save(purDetailExist);

    productExist.stock = productExist.stock + createEntranceDto.units;
    await this.productRepository.save(productExist);

    return plainToInstance(GetEntranceDto, createEntrance);
  }

  async findAll({ limit, page }: PaginationQueryDto) {
    const total = await this.entranceRepository.count();
    const pages = Math.ceil(total / limit);

    if (page > pages) {
      if (total === 0) throw new BadRequestException('Aun no hay Entradas');
      throw new HttpException(
        `El número de página ${page} no existe.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const entranceList = await this.entranceRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { create_at: 'DESC' },
    });

    // const entranceList = await this.entranceRepository
    //   .createQueryBuilder('entrance')
    //   .addSelect('entrance.units * entrance.unit_cost', 'total_price')
    //   .orderBy('entrance.create_at', 'DESC')
    //   .take(limit)
    //   .skip((page - 1) * limit)
    //   .getMany();

    const data = entranceList.map((e: Entrance) =>
      plainToInstance(GetEntranceDto, e),
    );
    return {
      totalPages: pages,
      actualPage: page,
      nextPage: page < pages && pages > 0 ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      data,
    } as PaginationResponseDto<GetEntranceDto[]>;
  }

  //* Método para encontrar un proveedor (supplier) no eliminado mediante su id(uuid)
  async findOne(id: string) {
    // //Realizamos la busqueda del brand mediante su id en la base de datos
    // const findEntrance = await this.entranceRepository.findOne({
    //   relations: ['purchase_detail'],
    //   where: { id_entrance: id, delete_at: null },
    // });
    // //En caso de que el supplier no exista, lanzamos un error con el mesaje y código correspondiente
    // if (!findEntrance)
    //   throw new HttpException(
    //     `La Entrada con el id '${id}' no fue encontrado.`,
    //     HttpStatus.NOT_FOUND,
    //   );
    // //Si se encontró el supplier retornamos lo encontrado
    // return plainToInstance(GetEntranceDto, findEntrance);
  }

  //* Método para actualizar un proveedor (supplier) mediante su id(uuid)
  async update(id: string, updateEntranceDto: UpdateEntranceDto) {
    // //Obtenemos el supplier que deseamos actualizar
    // const entranceToUpdate = await this.entranceRepository.findOne({
    //   relations: ['product', 'supplier'],
    //   where: { id_entrance: id, delete_at: null },
    // });
    // //Si el supplier no fue encontrado devolveremos un error indicando que este no fue encontrado
    // if (!entranceToUpdate)
    //   throw new HttpException(
    //     `La entrada con el '${id} no fue encontrado.'`,
    //     HttpStatus.NOT_FOUND,
    //   );
    // //se procede a buscar si la marca existe
    // const productExist = await this.productRepository.findOne({
    //   where: { id_product: updateEntranceDto.id_product },
    // });
    // //se procede a buscar si la marca existe
    // const supplierExist = await this.supplierRepository.findOne({
    //   where: { id_supplier: updateEntranceDto.id_supplier },
    // });
    // //si la marca no existe dara un error
    // if (!productExist)
    //   throw new HttpException(
    //     `El producto'${updateEntranceDto.id_product}' no existe`,
    //     HttpStatus.CONFLICT,
    //   );
    // //si la marca no existe dara un error
    // if (!supplierExist)
    //   throw new HttpException(
    //     `El proveedor '${updateEntranceDto.id_supplier}' no existe`,
    //     HttpStatus.CONFLICT,
    //   );
    // productExist.stock =
    //   productExist.stock - entranceToUpdate.units + updateEntranceDto.units;
    // await this.productRepository.save(productExist);
    // //Si el supplier fue encontado actualizaremos la info del supplier con el dto
    // const entranceUpdate = this.entranceRepository.merge(
    //   entranceToUpdate,
    //   updateEntranceDto,
    // );
    // entranceUpdate.product = productExist;
    // entranceUpdate.supplier = supplierExist;
    // const updatedEntrance = await this.entranceRepository.save(entranceUpdate);
    // //Por último guardamos el supplier y retornamos la info actualizada
    // return plainToInstance(GetEntranceDto, updatedEntrance);
  }
  //* Método para eliminar de forma lógica un producto (priduct)
  async remove(id: string) {
    // //Buscamos el brand que queramos eliminar mediante su id
    // const entranceToRemove = await this.entranceRepository.findOne({
    //   relations: ['product', 'supplier'],
    //   where: { id_entrance: id, delete_at: null },
    // });
    // const productExist = await this.productRepository.findOne({
    //   where: { id_product: entranceToRemove.product.id_product },
    // });
    // if (!productExist)
    //   throw new HttpException(
    //     `El producto'${entranceToRemove.product.id_product}' no existe`,
    //     HttpStatus.CONFLICT,
    //   );
    // productExist.stock = productExist.stock - entranceToRemove.units;
    // await this.productRepository.save(productExist);
    // // Si el producto no fue encontrado o su propiedad delete_at no es null devolvemos un error
    // if (!entranceToRemove || entranceToRemove.delete_at != null)
    //   throw new HttpException(
    //     `La Entrada con el id '${id} no fue encontrado o ya fue removido.'`,
    //     HttpStatus.NOT_FOUND,
    //   );
    // await this.entranceRepository.softDelete(id);
    // //Retornamos los datos del producto registrado hacia el cliente
    // return plainToInstance(GetEntranceDto, entranceToRemove);
  }
}
