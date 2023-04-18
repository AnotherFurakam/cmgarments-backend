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
import { ProductSupplier } from 'src/model/productsupplier.entity';

@Injectable()
export class PurchaseDetailService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(Purchase_detail)
    private purchaseDetailRepository: Repository<Purchase_detail>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductSupplier)
    private productsupplierRepository: Repository<ProductSupplier>,
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
      relations: ['id_supplier'],
      where: { id_purchase: createPurchaseDetailDto.id_purchase },
    });

    if (!purchase)
      throw new HttpException(
        `La compra con el id '${createPurchaseDetailDto.id_product}' no fue econtrado.`,
        HttpStatus.NOT_FOUND,
      );

    const productS = await this.productsupplierRepository.findOne({
      relations: ['product', 'supplier'],
      where: { supplier: {name: purchase.id_supplier.name}, product: {id_product: createPurchaseDetailDto.id_product} },
    });

    if (!product)
      throw new HttpException(
        `El producto con el id '${createPurchaseDetailDto.id_product}' no fue econtrado.`,
        HttpStatus.NOT_FOUND,
      );

    if (!productS)
    throw new HttpException(
      `El productoSupplier con el id '${createPurchaseDetailDto.id_product}' no fue econtrado.`,
      HttpStatus.NOT_FOUND,
    );

      const purchaseDetailToRegist = this.purchaseDetailRepository.create(
        createPurchaseDetailDto,
      );
      purchaseDetailToRegist.id_purchase = purchase;
      purchaseDetailToRegist.id_product = product;

    var tp = parseFloat(purchase.total_price)


    tp += parseFloat(productS.unit_cost)*createPurchaseDetailDto.units


    tp = parseFloat(tp.toFixed(2))

    purchase.total_price = tp.toString()

    await this.purchaseRepository.save(purchase);

    
    purchaseDetailToRegist.price = productS.unit_cost

    const createPurchase = await this.purchaseDetailRepository.save(
      purchaseDetailToRegist,
    );

    purchase.total_price = tp.toString()

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
      relations: ['id_purchase'],
      where: { id_purchase_detail: id },
    });
    //Si el brand no fue encontrado devolveremos un error indicando que este no fue encontrado
    if (!purchaseDetailToUpdate)
      throw new HttpException(
        `El detalle de la compra con el '${id} no se encontró'`,
        HttpStatus.NOT_FOUND,
      );

    //Validar si la compra existe.
    const purchase = await this.purchaseRepository.findOne({
      relations: ['id_supplier'],
      where: { id_purchase: purchaseDetailToUpdate.id_purchase.id_purchase },
    });

    if (!purchase)
      throw new HttpException(
        `La compra con el id '${purchaseDetailToUpdate.id_product}' no fue econtrado.`,
        HttpStatus.NOT_FOUND,
    );

    const productS = await this.productsupplierRepository.findOne({
      relations: ['product', 'supplier'],
      where: { supplier: {name: purchase.id_supplier.name}, product: {id_product: updatePurchaseDetailDto.id_product} },
    });

    var tp = parseFloat(purchase.total_price)


    tp -= parseFloat(purchaseDetailToUpdate.price) * purchaseDetailToUpdate.units

    tp += parseFloat(productS.unit_cost) * updatePurchaseDetailDto.units


    purchase.total_price = tp.toString()

    await this.purchaseRepository.save(purchase);

    


    //Si el brand fue encontado actualizaremos la info del brand con el dto
    this.purchaseDetailRepository.merge(
      purchaseDetailToUpdate,
      updatePurchaseDetailDto,
    );

    purchaseDetailToUpdate.price = productS.unit_cost
    
    //Por último guardamos el brand y retornamos la info actualizada
    const updatedPurchaseDetal = await this.purchaseDetailRepository.save(
      purchaseDetailToUpdate,
    );

    return plainToInstance(GetPurchaseDetailDto, updatedPurchaseDetal);
  }

  async remove(id: string) {
    const purchaseDetailToRemove = await this.purchaseDetailRepository.findOne({
      relations: ['id_purchase'],
      where: { id_purchase_detail: id },
    });

    if (!purchaseDetailToRemove || purchaseDetailToRemove.delete_at)
      throw new HttpException(
        `El detalle de la compra con el id '${id}' no se encontró`,
        HttpStatus.NOT_FOUND,
      );
    
    //Validar si la compra existe.
    const purchase = await this.purchaseRepository.findOne({
      where: { id_purchase: purchaseDetailToRemove.id_purchase.id_purchase },
    });

    if (!purchase)
      throw new HttpException(
        `La compra con el id '${purchaseDetailToRemove.id_product}' no fue econtrado.`,
        HttpStatus.NOT_FOUND,
    );

    var purTP = parseFloat(purchase.total_price)

    purTP -= parseFloat(purchaseDetailToRemove.price)*purchaseDetailToRemove.units


    purchase.total_price = purTP.toString()
    
    await this.purchaseRepository.save(purchase);


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
