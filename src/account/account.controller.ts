import { Controller, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { create } from 'domain';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create.account.dto';

@Controller('account')
export class AccountController {
  private readonly accountService: AccountService;
}
