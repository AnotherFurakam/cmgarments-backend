import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from 'src/model/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/utils/paginate/dto';
import { ResponseCustomerDto } from './dto/response-customer.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  /**
   * Async function that finds all customers with pagination.
   * @param {PaginationQueryDto} limit - The maximum number of customers per page.
   * @param {PaginationQueryDto} page - The page number to retrieve.
   * @returns {Promise<PaginationResponseDto<ResponseCustomerDto[]>>} A promise that resolves to a pagination response with an array of customer data.
   * @throws {BadRequestException} If the requested page number is greater than the total number of pages or if there are no categories in the database.
   */
  async findAll({ limit, page }: PaginationQueryDto) {
    // obtener total y páginas de Categoria
    const total = await this.customerRepository.count();
    const pages = Math.ceil(total / limit);

    // verificar que la página solicitada no sea mayor a las páginas totales
    if (page > pages) {
      if (total === 0) throw new BadRequestException('Aun no hay Categorías');
      throw new BadRequestException(`El número de página ${page} no existe`);
    }

    //* obtener categorías
    // skip -> desde que posición
    // take -> cantidad
    const customers = await this.customerRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { create_at: 'ASC' },
    });

    // convertimos de tipo "Customer[]" a "ResponseCustomerDto[]"
    const customerData = customers.map((c) =>
      plainToInstance(ResponseCustomerDto, c),
    );

    // respuesta
    const data: PaginationResponseDto<ResponseCustomerDto[]> = {
      totalPages: pages,
      actualPage: page,
      nextPage: page < pages && pages > 0 ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      data: customerData,
    };

    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
