import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/model/customer.entity';
import { Product } from 'src/model/product.entity';
import { Sale } from 'src/model/sale.entity';
import { SaleDetail } from 'src/model/sale_detail.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { GetSaleDto } from './dto/get-sale.dto';
import { CustomerResponseDto } from 'src/auth/dto/customer-response.dto';
import { PaginationQueryDto, PaginationResponseDto } from 'src/utils/paginate/dto';
import { plainToInstance } from 'class-transformer';
import { GetOnlySaleDto } from './dto/get-onlysale.dto';
import { GetSaleDetailDto } from './dto/get-saleDetail.dto';

@Injectable()
export class SaleService {
    constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Sale) private saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetail)
    private saledetailRepository: Repository<SaleDetail>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly entityManager: EntityManager,
) {}

    async create(createSaleDto: CreateSaleDto): Promise<GetSaleDto> {
    return await this.entityManager.transaction(
        async (transactionalEntityManager) => {
            console.log(createSaleDto.sale_details)
            // Buscar al cliente por ID
            const customer = await this.customerRepository.findOne({
            where: { id_customer: createSaleDto.id_customer },
            });
            if (!customer) {
            throw new HttpException(
                `El Customer '${createSaleDto.id_customer}', no se ha encontrado.`,
                HttpStatus.CONFLICT,
            );
            }

        

        // Crear los detalles de venta
        const saleDetails: SaleDetail[] = [];
        
        for (const saleDetailDto of createSaleDto.sale_details) {
            if (saleDetailDto.state) {
                const product = await this.productRepository.findOne({
                where: { id_product: saleDetailDto.product_id },
                });
                if (!product) {
                throw new HttpException(
                    `El producto '${saleDetailDto.product_id}', no se ha encontrado.`,
                    HttpStatus.CONFLICT,
                );
                }

                const saleDetail = new SaleDetail();
                saleDetail.product = product;
                saleDetail.units = saleDetailDto.quantity;
                saleDetail.price = product.price;

                saleDetails.push(saleDetail);
            }
        }

        if (saleDetails.length === 0) {
            throw new HttpException(
                'No se han agregado detalles de venta. Por favor, agregue al menos un detalle de venta.',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Crear la venta
        const sale = new Sale();
        sale.customer = customer;
        sale.total_cost = '0';

        const savedSale = await this.saleRepository.save(sale);

        // Asignar la venta guardada a los detalles de venta y guardar los detalles
        for (const saleDetail of saleDetails) {
            saleDetail.sale = savedSale;
            await this.saledetailRepository.save(saleDetail);
        }
        
        // Actualizar el costo total de la venta
        savedSale.total_cost = saleDetails
            .reduce((total, detail) => total + detail.price * detail.units, 0)
            .toString();
        await this.saleRepository.save(savedSale);

        // Convertir la venta y sus detalles a GetSaleDto
        const getSaleDto = new GetSaleDto();
        Object.assign(getSaleDto, savedSale);

        const customerResponse = new CustomerResponseDto();
        Object.assign(customerResponse, customer);
        getSaleDto.customer = customerResponse;

        getSaleDto.sale_detail = saleDetails;

        const data = plainToInstance(GetSaleDto, getSaleDto);

        return data;
    }
    );
    }

    async findAll({ limit, page }: PaginationQueryDto) {
        const total = await this.saleRepository.count();
        const pages = Math.ceil(total / limit);
    
        if (page > pages) {
        if (total === 0) throw new BadRequestException('Aún no hay Ventas');
        throw new HttpException(
            `El número de página ${page} no existe.`,
            HttpStatus.BAD_REQUEST,
        );
        }
    
        const saleList = await this.saleRepository.find({
        relations: ['customer', 'sale_detail', 'sale_detail.product'],
        skip: (page - 1) * limit,
        take: limit,
        order: { create_at: 'ASC' },
        });
    
        const saleData = saleList.map((s: Sale) => plainToInstance(GetSaleDto, s));
    
        const data: PaginationResponseDto<GetOnlySaleDto[]> = {
        totalPages: pages,
        actualPage: page,
        nextPage: page < pages && pages > 0 ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        data: saleData,
        };
    
        return data;
    }

    async findAllDetails(pagination: PaginationQueryDto): Promise<PaginationResponseDto<GetSaleDetailDto[]>> {
        const { limit, page } = pagination;
        const total = await this.saledetailRepository.count();
        const pages = Math.ceil(total / limit);
        
        if (page > pages) {
            if (total === 0) throw new NotFoundException('Aún no hay detalles de venta');
            throw new BadRequestException(`El número de página ${page} no existe.`);
        }
        
        const saleDetails = await this.saledetailRepository.find({
            relations: ['sale', 'product'],
            skip: (page - 1) * limit,
            take: limit,
        });
        
        const saleDetailData = saleDetails.map((sd: SaleDetail) => plainToInstance(GetSaleDetailDto, sd));
        
        const data: PaginationResponseDto<GetSaleDetailDto[]> = {
            totalPages: pages,
            actualPage: page,
            nextPage: page < pages && pages > 0 ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            data: saleDetailData,
            };
        
        return data;
    }

    async findSaleDetails(id: string, pagination: PaginationQueryDto): Promise<PaginationResponseDto<GetSaleDetailDto[]>> {
        const { limit, page } = pagination;
        const total = await this.saledetailRepository.count();
        const pages = Math.ceil(total / limit);
        
        if (page > pages) {
            if (total === 0) throw new NotFoundException('Aún no hay detalles de venta');
            throw new BadRequestException(`El número de página ${page} no existe.`);
        }
        
        const saleDetails = await this.saledetailRepository.find({
            relations: ['sale', 'product'],
            where: { sale: { id_sale: id } },
            skip: (page - 1) * limit,
            take: limit,
        });

        if (!saleDetails) {
            throw new HttpException(
                `El producto '${id}', no se ha encontrado.`,
                HttpStatus.CONFLICT,
            );
        }
        
        const saleDetailData = saleDetails.map((sd: SaleDetail) => plainToInstance(GetSaleDetailDto, sd));
        
        const data: PaginationResponseDto<GetSaleDetailDto[]> = {
            totalPages: pages,
            actualPage: page,
            nextPage: page < pages && pages > 0 ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            data: saleDetailData,
            };
        
        return data;
    }

    async remove(id: string) {
        // Buscamos la venta que queremos eliminar mediante su id
        const saleToRemove = await this.saleRepository.findOne({
        relations: ['sale_detail'],
        where: { id_sale: id },
        });
    
        // Si la venta no fue encontrada o su propiedad is_delete no es null devolvemos un error
        if (!saleToRemove || saleToRemove.is_delete)
        throw new HttpException(
            `La venta con el id '${id} no fue encontrada o ya fue removida.'`,
            HttpStatus.NOT_FOUND,
        );
    
        // Actualizamos el estado is_delete de todos los detalles de venta relacionados a la venta
        await Promise.all(
        saleToRemove.sale_detail.map(async (detail) => {
            detail.is_delete = true;
            await this.saledetailRepository.save(detail);
        })
        );
    
        // Actualizamos el estado is_delete de la venta a true
        saleToRemove.is_delete = true;
        await this.saleRepository.save(saleToRemove);
            
        // Retornamos los datos de la venta eliminada hacia el cliente
        return plainToInstance(GetSaleDto, saleToRemove);
    }
}
