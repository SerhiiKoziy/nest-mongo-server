import { Injectable, Res } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { Response } from 'express';
import { Readable } from 'stream';

import { CreateDetailDto } from './dto/createDetail.dto';
import { UpdateDetailDto } from './dto/updateDetail.dto';
import { DetailRepository } from './detail.repository';
import { Detail } from './detail.model';
import { PdfService } from '../pdf/pdf.service';

@Injectable()
export class DetailService {
  constructor(
    private readonly detailRepository: DetailRepository,
    private pdfService: PdfService
  ) {}

  async create(createDetailDto: CreateDetailDto, session: ClientSession, @Res() res: Response) {
    const createDetail = await this.detailRepository.createDetail(createDetailDto, session);

    try {
      const dynamicFilename = `generated-${Date.now()}.pdf`;
      const pdfBuffer = await this.pdfService.generatePdf(createDetail, dynamicFilename);

      const pdfStream = Readable.from(pdfBuffer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${dynamicFilename}`);

      pdfStream.pipe(res);
    } catch (error) {
      res.status(500).send('Error generating and sending PDF');
    }
  }

  async getDetailById(id: MongooseSchema.Types.ObjectId): Promise<Detail> {
    return await this.detailRepository.getDetailById(id);
  }

  update(id: number, updateDetailDto: UpdateDetailDto) {
    return `This action updates a #${id} detail`;
  }

  remove(id: number) {
    return `This action removes a #${id} detail`;
  }
}
