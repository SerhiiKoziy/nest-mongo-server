import {
  Controller,
  HttpStatus,
  Post,
  Body,
  HttpCode, UseGuards, Res, BadRequestException
} from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfDto } from './dto/pdf.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { Connection } from 'mongoose';
import {InjectConnection} from '@nestjs/mongoose';

@ApiTags('Pdfs')
@Controller('pdf')
export class PdfController {
  constructor(@InjectConnection() private readonly mongoConnection: Connection, private pdfService: PdfService,) {
  }

  @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  @Post('/acceptOffer')
  async acceptOffer(@Body() pdfDto: PdfDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const pdf = await this.pdfService.acceptOffer(pdfDto, res);
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(pdf);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  @Post('/declineOffer')
  async declineOffer(@Body() pdfDto: PdfDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const result = await this.pdfService.declineOffer(pdfDto, res);
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(result);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }
}
