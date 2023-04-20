import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { AccountModule } from './account/account.module';
import { EmployeeModule } from './employee/employee.module';
import { RoleModule } from './role/role.module';
import { SupplierModule } from './supplier/supplier.module';
import { EntranceModule } from './entrance/entrance.module';
import { PurchaseModule } from './purchase/purchase.module';
import { PurchaseDetailModule } from './purchase_detail/purchase_detail.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ProductSupplierModule } from './productsupplier/productsupplier.module';
import { AuthModule } from './auth/auth.module';
import { SaleModule } from './sale/sale.module';
import { CustomerModule } from './customer/customer.module';
import { OutputModule } from './output/output.module';

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
    SaleModule,
    EntranceModule,
    BrandModule,
    ProductModule,
    CategoryModule,
    AccountModule,
    EmployeeModule,
    RoleModule,
    SupplierModule,
    PurchaseModule,
    PurchaseDetailModule,
    CloudinaryModule,
    ProductSupplierModule,
    AuthModule,
    CustomerModule,
    OutputModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
