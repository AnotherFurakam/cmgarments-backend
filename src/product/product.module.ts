import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/model/product.entity';
import { Brand } from '../model/brand.entity';
import { BrandService } from '../brand/brand.service';
import { BrandController } from '../brand/brand.controller';
import { Repository } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), TypeOrmModule.forFeature([Brand])],
    providers: [ProductService, BrandService, Repository],
    controllers: [ProductController, BrandController]
})
export class ProductModule{}