import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BrandController } from "src/brand/brand.controller";
import { BrandService } from "src/brand/brand.service";
import { CategoryController } from "src/category/category.controller";
import { CategoryService } from "src/category/category.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { Brand } from "src/model/brand.entity";
import { Category } from "src/model/category.entity";
import { Image } from "src/model/image.entity";
import { Product } from "src/model/product.entity";
import { ProductSupplier } from "src/model/productsupplier.entity";
import { Purchase_detail } from "src/model/purchase_detail.entity";
import { Supplier } from "src/model/supplier.entity";
import { ProductController } from "src/product/product.controller";
import { ProductService } from "src/product/product.service";
import { SupplierController } from "src/supplier/supplier.controller";
import { SupplierService } from "src/supplier/supplier.service";
import { Repository } from "typeorm";
import { ProductSupplierController } from "./productsupplier.controller";
import { ProductSupplierService } from "./productsupplier.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
          ProductSupplier,
          Product,
          Supplier,
          Brand,
          Category,
          Purchase_detail,
          Image,
        ]),
        CloudinaryModule,
      ],    providers: [ProductSupplierService, ProductService, SupplierService, BrandService, CategoryService, Repository],
    controllers: [ProductSupplierController, ProductController, SupplierController, BrandController, CategoryController],
    
})
export class ProductSupplierModule{}