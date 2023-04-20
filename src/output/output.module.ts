import { Module } from '@nestjs/common';
import { OutputService } from './output.service';
import { OutputController } from './output.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Output } from 'src/model/output.entity';
import { Product } from 'src/model/product.entity';
import { SaleDetail } from 'src/model/sale_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Output, Product, SaleDetail])],
  controllers: [OutputController],
  providers: [OutputService],
  exports: [OutputService],
})
export class OutputModule {}
