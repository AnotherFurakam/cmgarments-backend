import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/model/product.entity';
import { Brand } from '../model/brand.entity';
import { BrandService } from '../brand/brand.service';
import { BrandController } from '../brand/brand.controller';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { Category } from '../model/category.entity';
import { CategoryController } from '../category/category.controller';
import { Purchase_detail } from 'src/model/purchase_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Brand]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Purchase_detail]),
  ],
  providers: [ProductService, BrandService, CategoryService, Repository],
  controllers: [ProductController, BrandController, CategoryController],
})
export class ProductModule {}
