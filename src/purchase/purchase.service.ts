import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Purchase } from 'src/model/purchase.entity';
import { Supplier } from 'src/model/supplier.entity';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/utils/paginate/dto';
import { Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { GetPurchaseDto } from './dto/get-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  // Crear compra
  async create(createPurchaseDto: CreatePurchaseDto) {
    const supplier = await this.supplierRepository.findOne({
      where: { id_supplier: createPurchaseDto.id_supplier },
    });

    if (!supplier)
      throw new HttpException(
        `El proveedor con el id '${createPurchaseDto.id_supplier}' no fue econtrado.`,
        HttpStatus.NOT_FOUND,
      );

    const purchaseToRegist = this.purchaseRepository.create(createPurchaseDto);

    purchaseToRegist.id_supplier = supplier;
    const createPurchase = await this.purchaseRepository.save(purchaseToRegist);

    return plainToInstance(GetPurchaseDto, createPurchase);
  }

  // Obtener todas las compras
  async findAll({
    limit,
    page,
  }: PaginationQueryDto): Promise<PaginationResponseDto<GetPurchaseDto[]>> {
    const total = await this.purchaseRepository.count();

    const pages = Math.ceil(total / limit);

    if (page > pages)
      throw new HttpException(
        `El pagina n° ${page} no existe`,
        HttpStatus.BAD_REQUEST,
      );

    const purchaseList = await this.purchaseRepository.find({
      relations: ['id_supplier'],
      skip: (page - 1) * limit,
      take: limit,
      order: { create_at: 'ASC' },
      where: {
        delete_at: null,
      },
    });

    const data = purchaseList.map((e: Purchase) =>
      plainToClass(GetPurchaseDto, e),
    );

    return {
      totalPages: pages,
      actualPage: page,
      nextPage: page < pages && pages > 0 ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      data,
    } as PaginationResponseDto<GetPurchaseDto[]>;
  }

  //Obtener compra por id
  async findOne(id: string): Promise<GetPurchaseDto> {
    //Realizamos la busqueda del brand mediante su id en la base de datos
    const findPurchase = await this.purchaseRepository.findOne({
      relations: ['id_supplier'],
      where: { id_purchase: id, delete_at: null },
    });

    //En caso de que el brand no exista, lanzamos un error con el mesaje y código correspondiente
    if (!findPurchase)
      throw new HttpException(
        `La compra con id el '${id}' no se encontró`,
        HttpStatus.NOT_FOUND,
      );

    return plainToClass(GetPurchaseDto, findPurchase);
  }

  async findByNumber(num: number) {
    const purchase = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.id_supplier', 'supplier')
      .leftJoinAndSelect('purchase.purchase_detail', 'purchase_detail')
      .leftJoinAndSelect('purchase_detail.id_product', 'product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category')
      .select([
        'purchase.id_purchase',
        'purchase.nro',
        'purchase.description',
        'purchase.total_price',
        'purchase.date_purchase',
        'purchase.create_at',
        'supplier.id_supplier',
        'supplier.name',
        'supplier.address',
        'supplier.phone',
        'supplier.ruc',
        'purchase_detail.id_purchase_detail',
        'purchase_detail.units',
        'purchase_detail.price',
        'purchase_detail.received',
        'product.name',
        'product.color',
        'brand.id_brand',
        'brand.name',
        'category.id_category',
        'category.name',
      ])
      .where('purchase.nro = :nro', { nro: num })
      .take(1)
      .getOne();

    if (!purchase)
      throw new HttpException(
        `La compra con número '${num}' no se encontró`,
        HttpStatus.NOT_FOUND,
      );

    return purchase;
    // return plainToClass(GetPurchaseDto, purchase);
  }

  //* Método para actualizar una compra
  async update(
    id: string,
    updatePurchaseDto: UpdatePurchaseDto,
  ): Promise<GetPurchaseDto> {
    //Obtenemos la compra que deseamos actualizar
    const purchaseToUpdate = await this.purchaseRepository.findOne({
      where: { id_purchase: id },
    });
    //Si la compra no fue encontrado devolveremos un error indicando que este no fue encontrado
    if (!purchaseToUpdate)
      throw new HttpException(
        `La compra con el '${id} no se encontró'`,
        HttpStatus.NOT_FOUND,
      );

    //Si la compra fue encontado actualizaremos la info del brand con el dto
    this.purchaseRepository.merge(purchaseToUpdate, updatePurchaseDto);

    //Por último guardamos el brand y retornamos la info actualizada
    const updatedPurchase = await this.purchaseRepository.save(
      purchaseToUpdate,
    );

    return plainToInstance(GetPurchaseDto, updatedPurchase);
  }

  async remove(id: string) {
    console.log(id);
    const purchaseToRemove = await this.purchaseRepository.findOne({
      where: { id_purchase: id },
    });

    if (!purchaseToRemove || purchaseToRemove.delete_at)
      throw new HttpException(
        `La compra con el id '${id}' no se encontró`,
        HttpStatus.NOT_FOUND,
      );

    await this.purchaseRepository.softDelete(id);

    return plainToInstance(GetPurchaseDto, purchaseToRemove);
  }
}
