import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { Invoice } from './invoice.model';
import { CreateInvoiceDto } from './dto/createInvoice.dto';

export class InvoiceRepository {
  constructor(@InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto, session: ClientSession) {
    let invoice = await this.getInvoiceById(createInvoiceDto.invoiceId);

    if (invoice) {
      throw new ConflictException('Detail already exists');
    }

    try {
      invoice = await this.invoiceModel.create({
        name: createInvoiceDto.name,
        description: createInvoiceDto.description,
        recipientEmail: createInvoiceDto.recipientEmail,
        details: createInvoiceDto.details,
        _id: createInvoiceDto.invoiceId
      });

      invoice = await invoice.save({ session });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!invoice) {
      throw new ConflictException('Detail not created');
    }

    return invoice;
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    let invoice: Invoice;
    try {
      invoice = await this.invoiceModel.findById({ _id: id }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return invoice;
  }
}
