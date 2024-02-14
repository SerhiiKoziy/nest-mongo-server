import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { Response } from 'express';
import { Readable } from 'stream';

import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { InvoiceRepository } from './invoice.repository';
import { Invoice } from './invoice.model';
import { PdfService } from '../pdf/pdf.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository, private pdfService: PdfService, private authService: AuthService) {}

  async create(createInvoiceDto: CreateInvoiceDto, session: ClientSession, res: Response) {
    const userId = await this.authService.getUserIdFromToken(res);

    const createInvoice = await this.invoiceRepository.createInvoice(createInvoiceDto, session, userId);
    await this.generateAndSendPDF(createInvoice, res);
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    return await this.invoiceRepository.getInvoiceById(id);
  }

  async getAllInvoices(res: Response): Promise<Invoice[]> {
    const userId = await this.authService.getUserIdFromToken(res);

    return await this.invoiceRepository.getAll(userId);
  }

  private async generateAndSendPDF(createInvoice: Invoice, res: Response) {
    try {
      const dynamicFilename = `generated-${Date.now()}.pdf`;
      const result = await this.pdfService.generatePDF(createInvoice, dynamicFilename);

      const pdfStream = Readable.from(result);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${dynamicFilename}`);

      pdfStream.pipe(res);
    } catch (error) {
      res.status(500).send('Error generating and sending PDF');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} detail`;
  }
}
