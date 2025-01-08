import { Controller, Get, Post, Body, Param, Delete, Res, HttpCode, HttpStatus, BadRequestException, UseGuards } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { Invoice } from './invoice.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(@InjectConnection() private readonly mongoConnection: Connection, private readonly invoiceService: InvoiceService) {}

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create invoice' })
  @ApiResponse({ status: 200, type: Invoice })
  @Post('/createInvoice')
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const newInvoice = await this.invoiceService.create(createInvoiceDto, session, res);
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(newInvoice);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get invoice by id' })
  @Get('/getInvoiceById/:id')
  async getInvoiceById(@Param('id') id: number, @Res() res: Response) {
    const invoice = await this.invoiceService.getInvoiceById(id.toString());

    return res.status(HttpStatus.OK).send(invoice);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all invoices' })
  @Get('/getAllInvoices')
  async getAllInvoices(@Res() res: Response) {
    const invoices = await this.invoiceService.getAllInvoices(res);

    return res.status(HttpStatus.OK).send(invoices);
  }

  @Delete('/invoice/:id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(+id);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send again invoice' })
  @Get('/sendAgain')
  async sendAgain(@Res() res: Response) {
    const invoices = await this.invoiceService.getAllInvoices(res);

    return res.status(HttpStatus.OK).send(invoices);
  }
}
