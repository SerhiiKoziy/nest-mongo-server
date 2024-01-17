import { Injectable, Res } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { Response } from 'express';
import { Readable } from 'stream';

import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { UpdateInvoiceDto } from './dto/updateInvoice.dto';
import { InvoiceRepository } from './invoice.repository';
import { Invoice } from './invoice.model';
import { PdfService } from '../pdf/pdf.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private pdfService: PdfService
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, session: ClientSession, @Res() res: Response) {
    const createDetail = await this.invoiceRepository.createInvoice(createInvoiceDto, session);

    try {
      const dynamicFilename = `generated-${Date.now()}.pdf`;
      const { content} = await this.pdfService.generatePdf(createDetail, dynamicFilename);

      const pdfStream = Readable.from(content);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${dynamicFilename}`);

      pdfStream.pipe(res);
    } catch (error) {
      res.status(500).send('Error generating and sending PDF');
    }
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    return await this.invoiceRepository.getInvoiceById(id);
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} detail`;
  }

  remove(id: number) {
    return `This action removes a #${id} detail`;
  }
}
