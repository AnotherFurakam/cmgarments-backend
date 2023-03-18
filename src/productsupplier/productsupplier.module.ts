import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BrandController } from "src/brand/brand.controller";
import { BrandService } from "src/brand/brand.service";
import { CategoryController } from "src/category/category.controller";
import { CategoryService } from "src/category/category.service";
import { Brand } from "src/model/brand.entity";
import { Category } from "src/model/category.entity";
import { Product } from "src/model/product.entity";
import { ProductSupplier } from "src/model/productsupplier.entity";
import { Supplier } from "src/model/supplier.entity";
import { ProductController } from "src/product/product.controller";
import { ProductService } from "src/product/product.service";
import { SupplierController } from "src/supplier/supplier.controller";
import { SupplierService } from "src/supplier/supplier.service";
import { Repository } from "typeorm";
import { ProductSupplierController } from "./productsupplier.controller";
import { ProductSupplierService } from "./productsupplier.service";

@Module({
    imports: [TypeOrmModule.forFeature([ProductSupplier]), TypeOrmModule.forFeature([Product]), TypeOrmModule.forFeature([Supplier]), TypeOrmModule.forFeature([Brand]), TypeOrmModule.forFeature([Category])],
    providers: [ProductSupplierService, ProductService, SupplierService, BrandService, CategoryService, Repository],
    controllers: [ProductSupplierController, ProductController, SupplierController, BrandController, CategoryController]
})
export class ProductSupplierModule{}