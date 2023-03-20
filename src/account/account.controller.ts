import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AccountService } from './account.service';
import { LoginAccountDto } from './dto/login-account.dto';

@Controller('account')
@ApiTags('Account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('auth/login')
  // @UseGuards(AuthGuard('local'))
  @ApiResponse({
    status: 200,
    description: 'Logeado Correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'Problema con las credenciales',
  })
  login(@Body() loginAccountDto: LoginAccountDto) {
    return this.accountService.login(loginAccountDto);
  }
}
