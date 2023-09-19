import { Module } from '@nestjs/common';
import { DetailService } from './detail.service';
import { DetailController } from './detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Detail, DetailSchema } from './detail.model';
import { DetailRepository } from './detail.repository';


@Module({
  imports: [MongooseModule.forFeature([{ name: Detail.name, schema: DetailSchema }])],
  controllers: [DetailController],
  providers: [DetailService, DetailRepository],
  exports: [DetailService, DetailRepository],
})
export class DetailModule {}
