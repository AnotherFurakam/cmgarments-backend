import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/model/product.entity';
import { Purchase } from 'src/model/purchase.entity';
import { Purchase_detail } from 'src/model/purchase_detail.entity';
import { PurchaseDetailController } from './purchase_detail.controller';
import { PurchaseDetailService } from './purchase_detail.service';
import { ProductSupplier } from 'src/model/productsupplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase_detail, Product, Purchase, ProductSupplier])],
  controllers: [PurchaseDetailController],
  providers: [PurchaseDetailService],
  exports: [PurchaseDetailService],
})
export class PurchaseDetailModule {}
