import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/model/customer.entity';
import { QueryFailedError, Repository, TypeORMError } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { plainToInstance } from 'class-transformer';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    private readonly jwtService: JwtService
  ) { }


  /**
   * Registrar cliente en la base de datos del sistema
   * @param registerDto RegisterDto
   * @returns CustomerResponseDto
   */
  async register(registerDto: RegisterDto): Promise<CustomerResponseDto> {
    const { password } = registerDto;
    const plainToHash = await hash(password, 10);
    registerDto = { ...registerDto, password: plainToHash };
    const createdCustomer = await this.customerRepository.save(registerDto)
      .then((response) => response)
      .catch((err: QueryFailedError) => {
        const detail: string = err.driverError.detail
        const constraints = ['email', 'dni']
        constraints.forEach(c => {
          if (detail.includes(c)) {
            throw new BadRequestException(`El ${c} ya existe`)
          }
        })
      })
    return plainToInstance(CustomerResponseDto, createdCustomer)
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const findUser = await this.customerRepository.findOne({
      where: {
        email
      }
    });
    if (!findUser) throw new NotFoundException("Usuario no encontrado");

    const checkPassword = await compare(password, findUser.password)

    if (!checkPassword) throw new ForbiddenException("Email o contraseña incorrecta");

    const customerDto = plainToInstance(CustomerResponseDto, findUser);

    const token = await this.jwtService.sign({
      id: customerDto.id_customer,
      name: customerDto.names.split(' ')[0],
      lastname: customerDto.first_lastname,
      email: customerDto.email
    });

    const data: LoginResponseDto = {
      customer: customerDto,
      token
    }

    return data;
  }
}
