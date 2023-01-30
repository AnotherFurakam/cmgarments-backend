
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/model/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create.account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const createAccount = await this.accountRepository.save(createAccountDto);

    return createAccount;
  }

  

}
