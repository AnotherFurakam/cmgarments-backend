import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/model/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create.account.dto';
import { LoginAccountDto } from './dto/login-account.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    private jwtService: JwtService,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const createAccount = await this.accountRepository.save(createAccountDto);

    return createAccount;
  }

  async login({ username, password }: LoginAccountDto) {
    const logeo = await this.accountRepository.findOne({
      where: { username, password_hash: password },
    });

    const payload = { username };

    if (!logeo) throw new UnauthorizedException(`Credenciales incorrectas`);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
