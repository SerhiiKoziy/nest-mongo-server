import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice, InvoiceSchema } from './invoice.model';
import { InvoiceRepository } from './invoice.repository';
import { PdfService } from '../pdf/pdf.service';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    RolesModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [InvoiceController],
  providers: [PdfService, InvoiceService, InvoiceRepository],
  exports: [InvoiceService, InvoiceRepository]
})

export class InvoiceModule {}

