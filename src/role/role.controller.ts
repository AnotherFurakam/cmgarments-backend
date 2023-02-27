import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/utils/paginate/dto';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('Role')
export class RoleController {

  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll(
    @Query()
    paginationQuery: PaginationQueryDto,
  ) {
    return this.roleService.findAll(paginationQuery);
  }

}
