import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Account } from 'src/model/account.entity';
import { Employee } from 'src/model/employee.entity';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/utils/paginate/dto';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create.employee.dto';
import { GetEmployeeDto } from './dto/get.employee.dto';
import { UpdateEmployeeDto } from './dto/update.employee.dto';
import { Role } from 'src/model/role.entity';
import { ResponseCountDto } from '../utils/dto/response-count.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private employeRepository: Repository<Employee>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  // Registrar Empleado:
  async create(createEmployeeDto: CreateEmployeeDto): Promise<GetEmployeeDto> {
    //Buscamos si el dni del empleado ya fue registrado en la base de datos
    const EmployeeExist = await this.employeRepository.findOne({
      where: { dni: createEmployeeDto.dni },
    });

    //Si el dni del brand ya fue registrado lanzamos un error que diga que ya fue registrado
    //El código de estado a utilizar sera el CONFLIC -> para indicar conflictos al registrar
    if (EmployeeExist)
      throw new HttpException(
        `El empleado con el dni n° '${createEmployeeDto.dni}' ya existe`,
        HttpStatus.CONFLICT,
      );

    const role = await this.roleRepository.findOne({
      where: { id_role: createEmployeeDto.id_role },
    });

    if (!role)
      throw new HttpException(
        `El role con el id '${createEmployeeDto.id_role}' no fue econtrado.`,
        HttpStatus.NOT_FOUND,
      );

    //Si el empleado no fue registrado se procederá a guardar en la base de datos
    //Si el rol ingresado existe
    const employeeToRegist = this.employeRepository.create(createEmployeeDto);
    employeeToRegist.role = role;
    const createEmployee = await this.employeRepository.save(employeeToRegist);

    //Instanciamos la clase createAccountDto y le pasamos las propiades que necesita para poder
    //Crear una cuenta
    const createAccount = new Account();
    createAccount.username = createEmployee.dni;
    createAccount.password_hash = createEmployee.dni;
    createAccount.employee = createEmployee;
    // Guardamos la cuenta creada anteriormente
    await this.accountRepository.save(createAccount);

    //Retornamos los datos del empleado registrado hacia el cliente
    return plainToInstance(GetEmployeeDto, createEmployee);
  }

  // Obtener todos los empleados:
  async findAll({
    limit,
    page,
  }: PaginationQueryDto): Promise<PaginationResponseDto<GetEmployeeDto[]>> {
    const total = await this.employeRepository.count();

    const pages = Math.ceil(total / limit);

    if (page > pages)
      throw new HttpException(
        `El pagina n° ${page} no existe`,
        HttpStatus.BAD_REQUEST,
      );

    const employeeList = await this.employeRepository.find({
      relations: ['role'],
      skip: (page - 1) * limit,
      take: limit,
      order: { create_at: 'ASC' },
      where: {
        delete_at: null,
      },
    });

    const data = employeeList.map((e: Employee) =>
      plainToClass(GetEmployeeDto, e),
    );

    return {
      totalPages: pages,
      actualPage: page,
      nextPage: page < pages && pages > 0 ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      data,
    } as PaginationResponseDto<GetEmployeeDto[]>;
  }

  //Obtener empleados por id:
  async findOne(id: string): Promise<GetEmployeeDto> {
    //Realizamos la busqueda del brand mediante su id en la base de datos
    const findEmployee = await this.employeRepository.findOne({
      relations: ['role'],
      where: { id_employee: id, delete_at: null },
    });

    //En caso de que el brand no exista, lanzamos un error con el mesaje y código correspondiente
    if (!findEmployee)
      throw new HttpException(
        `El empleado con id el '${id}' no se encontró`,
        HttpStatus.NOT_FOUND,
      );

    //Si se encontró el brand retornamos lo encontrado
    return plainToClass(GetEmployeeDto, findEmployee);
  }

  //* Método para actualizar una marca de producto (brand) mediante su id(uuid)
  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<GetEmployeeDto> {
    //Obtenemos el brand que deseamos actualizar
    const employeeToUpdate = await this.employeRepository.findOne({
      where: { id_employee: id },
    });
    //Si el brand no fue encontrado devolveremos un error indicando que este no fue encontrado
    if (!employeeToUpdate)
      throw new HttpException(
        `El empleado con el '${id} no se encontró'`,
        HttpStatus.NOT_FOUND,
      );

    //Si el brand fue encontado actualizaremos la info del brand con el dto
    this.employeRepository.merge(employeeToUpdate, updateEmployeeDto);

    //Por último guardamos el brand y retornamos la info actualizada
    const updatedEmployee = await this.employeRepository.save(employeeToUpdate);

    return plainToInstance(GetEmployeeDto, updatedEmployee);
  }

  async remove(id: string) {
    console.log(id);
    const employeeToRemove = await this.employeRepository.findOne({
      where: { id_employee: id },
    });

    if (!employeeToRemove || employeeToRemove.delete_at)
      throw new HttpException(
        `El empleado con el id '${id}' no se encontró`,
        HttpStatus.NOT_FOUND,
      );

    await this.employeRepository.softDelete(id);

    return plainToInstance(GetEmployeeDto, employeeToRemove);
  }

  //? (GET) - Obtener cantidad de EMPLEADOS
  async getQuantity() {
    const total = await this.employeRepository.count();
    const data: ResponseCountDto = { type: 'Empleados', total };

    return data;
  }
}
