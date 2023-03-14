import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from 'src/model/purchase.entity';
import { Supplier } from 'src/model/supplier.entity';
import { Purchase_detail } from 'src/model/purchase_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, Supplier, Purchase_detail])],
  providers: [PurchaseService],
  controllers: [PurchaseController],
  exports: [PurchaseService],
})
export class PurchaseModule {}
