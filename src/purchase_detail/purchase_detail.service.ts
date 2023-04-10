import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Product } from 'src/model/product.entity';
import { Purchase } from 'src/model/purchase.entity';
import { Purchase_detail } from 'src/model/purchase_detail.entity';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/utils/paginate/dto';
import { Repository } from 'typeorm';
import { CreatePurchaseDetailDto } from './dto/create-purchase-detail.dto';
import { GetPurchaseDetailDto } from './dto/get-purchase-detail.dto';
import { UpdatePurchaseDetailDto } from './dto/update-purchase-detail.dto';

@Injectable()
export class PurchaseDetailService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(Purchase_detail)
    private purchaseDetailRepository: Repository<Purchase_detail>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Crear detalle compra
  async create(createPurchaseDetailDto: CreatePurchaseDetailDto) {
    // Validar sio el producto existe.
    const product = await this.productRepository.findOne({
      where: { id_product: createPurchaseDetailDto.id_product },
    });

    if (!product)
      throw new HttpException(
        `El producto con el id '${createPurchaseDetailDto.id_product}' no fue econtrado.`,
        HttpStatus.NOT_FOUND,
      );

    //Validar si la compra existe.
    const purchase = await this.purchaseRepository.findOne({
      where: { id_purchase: createPurchaseDetailDto.id_purchase },
    });

    if (!purchase)
      throw new HttpException(
        `La compra con el id '${createPurchaseDetailDto.id_product}' no fue econtrado.`,
        HttpStatus.NOT_FOUND,
      );

    const purchaseDetailToRegist = this.purchaseDetailRepository.create(
      createPurchaseDetailDto,
    );
    purchaseDetailToRegist.id_purchase = purchase;
    purchaseDetailToRegist.id_product = product;
    const createPurchase = await this.purchaseDetailRepository.save(
      purchaseDetailToRegist,
    );

    const suma =
      createPurchaseDetailDto.price * createPurchaseDetailDto.units +
      Number(purchase.total_price);

    // console.log({
    //   n1: createPurchaseDetailDto.price,
    //   n2: createPurchaseDetailDto.units,
    //   suma,
    // });

    purchase.total_price = suma;

    await this.purchaseRepository.save(purchase);

    return plainToInstance(GetPurchaseDetailDto, createPurchase);
  }

  // Obtener todas las compras
  async findAll({
    limit,
    page,
  }: PaginationQueryDto): Promise<
    PaginationResponseDto<GetPurchaseDetailDto[]>
  > {
    const total = await this.purchaseDetailRepository.count();

    const pages = Math.ceil(total / limit);

    if (page > pages)
      throw new HttpException(
        `El pagina n° ${page} no existe`,
        HttpStatus.BAD_REQUEST,
      );

    const purchaseList = await this.purchaseDetailRepository.find({
      relations: ['id_product', 'id_purchase'],
      skip: (page - 1) * limit,
      take: limit,
      order: { create_at: 'ASC' },
      where: {
        delete_at: null,
      },
    });

    const data = purchaseList.map((e: Purchase_detail) =>
      plainToClass(GetPurchaseDetailDto, e),
    );

    return {
      totalPages: pages,
      actualPage: page,
      nextPage: page < pages && pages > 0 ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      data,
    } as PaginationResponseDto<GetPurchaseDetailDto[]>;
  }

  //Obtener compra por id
  async findOne(id: string): Promise<GetPurchaseDetailDto> {
    //Realizamos la busqueda del brand mediante su id en la base de datos
    const findPurchaseDetail = await this.purchaseDetailRepository.findOne({
      relations: ['id_product', 'id_purchase'],
      where: { id_purchase_detail: id, delete_at: null },
    });

    //En caso de que el brand no exista, lanzamos un error con el mesaje y código correspondiente
    if (!findPurchaseDetail)
      throw new HttpException(
        `El detalle de la compra con id el '${id}' no se encontró`,
        HttpStatus.NOT_FOUND,
      );

    return plainToClass(GetPurchaseDetailDto, findPurchaseDetail);
  }

  //* Método para actualizar una compra
  async update(
    id: string,
    updatePurchaseDetailDto: UpdatePurchaseDetailDto,
  ): Promise<GetPurchaseDetailDto> {
    //Obtenemos el brand que deseamos actualizar
    const purchaseDetailToUpdate = await this.purchaseDetailRepository.findOne({
      where: { id_purchase_detail: id },
    });
    //Si el brand no fue encontrado devolveremos un error indicando que este no fue encontrado
    if (!purchaseDetailToUpdate)
      throw new HttpException(
        `El detalle de la compra con el '${id} no se encontró'`,
        HttpStatus.NOT_FOUND,
      );

    //Si el brand fue encontado actualizaremos la info del brand con el dto
    this.purchaseDetailRepository.merge(
      purchaseDetailToUpdate,
      updatePurchaseDetailDto,
    );

    //Por último guardamos el brand y retornamos la info actualizada
    const updatedPurchaseDetal = await this.purchaseDetailRepository.save(
      purchaseDetailToUpdate,
    );

    return plainToInstance(GetPurchaseDetailDto, updatedPurchaseDetal);
  }

  async remove(id: string) {
    console.log(id);
    const purchaseDetailToRemove = await this.purchaseDetailRepository.findOne({
      where: { id_purchase_detail: id },
    });

    if (!purchaseDetailToRemove || purchaseDetailToRemove.delete_at)
      throw new HttpException(
        `El detalle de la compra con el id '${id}' no se encontró`,
        HttpStatus.NOT_FOUND,
      );

    await this.purchaseDetailRepository.softDelete(id);

    return plainToInstance(GetPurchaseDetailDto, purchaseDetailToRemove);
  }

  //Metodos para obtener todos los detalles de compra por id de compra
  async findAllByIdPurchase(
    id: any,
    { limit, page }: PaginationQueryDto,
  ): Promise<PaginationResponseDto<GetPurchaseDetailDto[]>> {
    const total = await this.purchaseDetailRepository.count();

    const pages = Math.ceil(total / limit);

    if (page > pages)
      throw new HttpException(
        `El pagina n° ${page} no existe`,
        HttpStatus.BAD_REQUEST,
      );

    const purchaseList = await this.purchaseDetailRepository.find({
      relations: ['id_product', 'id_purchase'],
      skip: (page - 1) * limit,
      take: limit,
      order: { create_at: 'ASC' },
      where: {
        id_purchase: id,
      },
    });

    const data = purchaseList.map((e: Purchase_detail) =>
      plainToClass(GetPurchaseDetailDto, e),
    );

    return {
      totalPages: pages,
      actualPage: page,
      nextPage: page < pages && pages > 0 ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      data,
    } as PaginationResponseDto<GetPurchaseDetailDto[]>;
  }
}
