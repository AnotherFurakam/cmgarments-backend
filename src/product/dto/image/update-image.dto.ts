import { PartialType } from '@nestjs/swagger';
import { CreateImageDto } from './create-image.dto';

// Utilizamos PartialType de swagger en vez de PartialType de mapped-types para que herede y tenga la documentacion
export class UpdateImageDto extends PartialType(CreateImageDto) {}
