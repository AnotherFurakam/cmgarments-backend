import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'El registro se completó satisfactoriamente',
  })
  @ApiResponse({
    status: 409,
    description: 'Hubo un conflicto al realizar el registro',
  })
  create(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Cliente logeado correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'Email o contraseña incorrecto',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
