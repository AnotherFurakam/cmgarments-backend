import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';

config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.PORT,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    BrandModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
