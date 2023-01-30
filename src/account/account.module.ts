import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/model/account.entity';
import { Employee } from 'src/model/employee.entity';
import { Role } from 'src/model/role.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports:  [TypeOrmModule.forFeature([Account, Employee, Role])],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
