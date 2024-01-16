import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DetailService } from './detail.service';
import { DetailController } from './detail.controller';
import { Detail, DetailSchema } from './detail.model';
import { DetailRepository } from './detail.repository';
import { PdfService } from '../pdf/pdf.service';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Detail.name, schema: DetailSchema }]),
    RolesModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [DetailController],
  providers: [PdfService, DetailService, DetailRepository],
  exports: [DetailService, DetailRepository]
})

export class DetailModule {}

