import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';
import { Response } from 'express';
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Template } from './template.model';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/createTemplate.dto';

@ApiTags('Template')
@Controller('template')
export class TemplateController {
  constructor(@InjectConnection() private readonly mongoConnection: Connection, private templateInvoice: TemplateService) {}

  @ApiOperation({ summary: 'Create template invoice' })
  @ApiResponse({ status: 200, type: Template })
  @UseGuards(JwtAuthGuard)
  @Post('/createTemplate')
  async create(@Body() createTemplateDto: CreateTemplateDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const template = await this.templateInvoice.create(createTemplateDto, session);
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(template);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }
}
