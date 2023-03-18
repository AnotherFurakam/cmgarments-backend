import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandController } from 'src/brand/brand.controller';
import { BrandService } from 'src/brand/brand.service';
import { CategoryController } from 'src/category/category.controller';
import { CategoryService } from 'src/category/category.service';
import { Brand } from 'src/model/brand.entity';
import { Category } from 'src/model/category.entity';
import { Entrance } from 'src/model/entrance.entity';
import { Product } from 'src/model/product.entity';
import { Supplier } from 'src/model/supplier.entity';
import { ProductController } from 'src/product/product.controller';
import { SupplierController } from 'src/supplier/supplier.controller';
import { SupplierService } from 'src/supplier/supplier.service';
import { EntranceController } from './entrance.controller';
import { EntranceService } from './entrance.service';
import { ProductModule } from '../product/product.module';

//? en la propiedad imports colocamos en modulo de producto para utilizar el servicio de producto
//* se podria colocar en la propiedad provider el servicio pero el servicio de producto utiliza otro servicio
@Module({
  imports: [
    TypeOrmModule.forFeature([Entrance, Product, Supplier, Brand, Category]),
    ProductModule,
  ],
  providers: [EntranceService, SupplierService, BrandService, CategoryService],
  controllers: [
    EntranceController,
    ProductController,
    SupplierController,
    BrandController,
    CategoryController,
  ],
})
export class EntranceModule {}
