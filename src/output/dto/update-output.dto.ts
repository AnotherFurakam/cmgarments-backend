import { PartialType } from '@nestjs/swagger';
import { CreateOutputDto } from './create-output.dto';

export class UpdateOutputDto extends PartialType(CreateOutputDto) {}
