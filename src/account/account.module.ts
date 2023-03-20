import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/model/account.entity';
import { Employee } from 'src/model/employee.entity';
import { Role } from 'src/model/role.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'OR1uGq9oHigCnS55rKzR4AjxDmWiyAbq',
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([Account, Employee, Role]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
