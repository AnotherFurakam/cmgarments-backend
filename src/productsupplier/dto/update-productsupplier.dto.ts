import { PartialType } from '@nestjs/swagger';
import { CreateProductSupplierDto } from './create-productsupplier.dto';

export class UpdateProductSupplierDto extends PartialType(CreateProductSupplierDto) {}
