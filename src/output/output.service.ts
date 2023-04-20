import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateOutputDto } from './dto/create-output.dto';
import { UpdateOutputDto } from './dto/update-output.dto';
import { Output } from 'src/model/output.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/model/product.entity';
import { SaleDetail } from 'src/model/sale_detail.entity';
import { GetOutputDto } from './dto/get-output.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OutputService {
  constructor(
    @InjectRepository(Output)
    private outputRepository: Repository<Output>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(SaleDetail)
    private saleDetailRepository: Repository<SaleDetail>,
  ) {}

  async create(createOutputDto: CreateOutputDto) {
    const saleDetailExist = await this.saleDetailRepository.findOne({
      relations: ['product'],
      where: { id_sale_detail: createOutputDto.id_sale_detail },
    });

    console.log(createOutputDto);
    console.log(saleDetailExist);

    if (!saleDetailExist)
      throw new BadRequestException(
        `El detalle '${createOutputDto.id_sale_detail}' no existe`,
      );

    //obtener producto
    const productExist = await this.productRepository.findOne({
      where: { id_product: saleDetailExist.product.id_product },
    });

    if (!productExist)
      throw new BadRequestException(
        `El producto '${saleDetailExist.product.id_product}' no existe`,
      );

    //se crea la salida y se guarda en la database
    const outputToRegist = this.outputRepository.create(createOutputDto);
    outputToRegist.sale_detail = saleDetailExist;
    const createEntrance = await this.outputRepository.save(outputToRegist);

    productExist.stock = productExist.stock - createOutputDto.units;
    await this.productRepository.save(productExist);

    return plainToInstance(GetOutputDto, createEntrance);
  }

  findAll() {
    return `This action returns all output`;
  }

  findOne(id: number) {
    return `This action returns a #${id} output`;
  }

  update(id: number, updateOutputDto: UpdateOutputDto) {
    return `This action updates a #${id} output`;
  }

  remove(id: number) {
    return `This action removes a #${id} output`;
  }
}
