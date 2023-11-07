import {forwardRef, Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DetailService } from './detail.service';
import { DetailController } from './detail.controller';
import { Detail, DetailSchema } from './detail.model';
import { DetailRepository } from './detail.repository';
import { PdfService } from '../pdf/pdf.service';
import {User, UserSchema} from '../user/user.model';
import {PdfModule} from '../pdf/pdf.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Detail.name, schema: DetailSchema }])],
  controllers: [DetailController],
  providers: [PdfService, DetailService, DetailRepository],
  exports: [DetailService, DetailRepository]
})

export class DetailModule {}

