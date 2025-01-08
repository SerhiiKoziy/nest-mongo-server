import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './createInvoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
