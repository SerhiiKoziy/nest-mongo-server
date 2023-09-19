import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailDto } from './createDetail.dto';

export class UpdateDetailDto extends PartialType(CreateDetailDto) {}
