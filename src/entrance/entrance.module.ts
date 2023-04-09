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
import { ProductService } from 'src/product/product.service';
import { PurchaseDetailService } from 'src/purchase_detail/purchase_detail.service';
import { PurchaseDetailModule } from 'src/purchase_detail/purchase_detail.module';
import { PurchaseDetailController } from 'src/purchase_detail/purchase_detail.controller';
import { Purchase_detail } from 'src/model/purchase_detail.entity';

//? en la propiedad imports colocamos en modulo de producto para utilizar el servicio de producto
//* se podria colocar en la propiedad provider el servicio pero el servicio de producto utiliza otro servicio
@Module({
  imports: [
    TypeOrmModule.forFeature([Entrance, Product, Supplier, Purchase_detail]),
    ProductModule,
  ],
  providers: [EntranceService],
  controllers: [EntranceController],
  exports: [EntranceService],
})
export class EntranceModule {}
