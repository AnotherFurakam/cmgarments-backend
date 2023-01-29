import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from 'src/model/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetRoleDto } from './dto/get-role.dto';
import { plainToClass } from 'class-transformer';
import { PaginationQueryDto, PaginationResponseDto } from 'src/utils/paginate/dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}


  async create(){

  }


  // Obtener todos los roles:
  async findAll({
    limit,
    page,
  }: PaginationQueryDto): Promise<PaginationResponseDto<GetRoleDto[]>> {
    const total = await this.roleRepository.count();

    const pages = Math.ceil(total / limit);

    if (page > pages)
      throw new HttpException(
        `The page number ${page} don't exist`,
        HttpStatus.BAD_REQUEST,
      );
    const roleList = await this.roleRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { create_at: 'ASC' },
      where: {
        delete_at: null,
      },
    });

    const data = roleList.map((r: Role) => plainToClass(GetRoleDto, r));

    return {
      totalPages: pages,
      actualPage: page,
      nextPage: page < pages && pages > 0 ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      data,
    } as PaginationResponseDto<GetRoleDto[]>;
  }


}
