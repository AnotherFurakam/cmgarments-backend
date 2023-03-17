import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/model/product.entity';
import { Brand } from '../model/brand.entity';
import { Image } from '../model/image.entity';
import { BrandService } from '../brand/brand.service';
import { BrandController } from '../brand/brand.controller';
import { CategoryService } from '../category/category.service';
import { Category } from '../model/category.entity';
import { CategoryController } from '../category/category.controller';
import { Purchase_detail } from 'src/model/purchase_detail.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

//? utilizamos la propiedad exports para exportar el servicio que vamos a utilizar en otro servicio
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Brand,
      Category,
      Purchase_detail,
      Image,
    ]),
    CloudinaryModule,
  ],
  providers: [ProductService, BrandService, CategoryService],
  controllers: [ProductController, BrandController, CategoryController],
  exports: [ProductService],
})
export class ProductModule {}
