import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BrandService } from "src/brand/brand.service";
import { CategoryService } from "src/category/category.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { Brand } from "src/model/brand.entity";
import { Category } from "src/model/category.entity";
import { Image } from '../model/image.entity';
import { Customer } from "src/model/customer.entity";
import { Product } from "src/model/product.entity";
import { Sale } from "src/model/sale.entity";
import { SaleDetail } from "src/model/sale_detail.entity";
import { ProductService } from "src/product/product.service";
import { SaleService } from "./sale.service";
import { AuthService } from "src/auth/auth.service";
import { ProductController } from "src/product/product.controller";
import { BrandController } from "src/brand/brand.controller";
import { CategoryController } from "src/category/category.controller";
import { SaleController } from "./sale.controller";
import { Entrance } from "src/model/entrance.entity";
import { Purchase } from "src/model/purchase.entity";
import { Purchase_detail } from "src/model/purchase_detail.entity";
import { EntranceService } from "src/entrance/entrance.service";
import { SupplierService } from "src/supplier/supplier.service";
import { Supplier } from "src/model/supplier.entity";

@Module({
    imports: [
    TypeOrmModule.forFeature([
        Product,
        Brand,
        Category,
        Sale,
        SaleDetail,
        Customer,
        Image,
        Entrance,
        Purchase,
        Purchase_detail,
        Supplier
    ]),
    CloudinaryModule,
    ],
    providers: [ProductService, BrandService, CategoryService, SaleService, EntranceService, SupplierService],
    controllers: [ProductController, BrandController, CategoryController, SaleController],
    exports: [SaleService],
})
export class SaleModule {}