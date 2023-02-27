import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from 'src/model/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/model/account.entity';
import { Role } from 'src/model/role.entity';
import { RoleService } from 'src/role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Account, Role])],
  providers: [EmployeeService, RoleService],
  controllers: [EmployeeController],
  exports: [EmployeeService], // Importrar modulos para injectarlos en otros servicios
})
export class EmployeeModule {}
