import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/model/customer.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { JWTStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.expiresIn,
      },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy]
})
export class AuthModule {}
