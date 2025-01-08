import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';
import { Response } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Template } from './template.model';
import { TemplateService } from './template.service';
import { UpdateTemplateDto } from './dto/updateTemplate.dto';

@ApiTags('Template')
@Controller('template')
export class TemplateController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private templateService: TemplateService,
  ) {}

  @ApiOperation({ summary: 'Create template invoice' })
  @ApiResponse({ status: 200, type: Template })
  @UseGuards(JwtAuthGuard)
  @Post('/createTemplate')
  async create(@Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const template = await this.templateService.create();
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(template);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @ApiOperation({ summary: 'Update template invoice' })
  @ApiResponse({ status: 200, type: Template })
  @UseGuards(JwtAuthGuard)
  @Patch('/updateTemplate')
  async update(
    @Body() updateTemplateDto: UpdateTemplateDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const updatedTemplate = await this.templateService.update(
        updateTemplateDto,
        session,
        res,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(updatedTemplate);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @ApiOperation({ summary: 'Get template by ID' })
  @ApiResponse({ status: 200, type: Template })
  @UseGuards(JwtAuthGuard)
  @Get('/getTemplate')
  async getTemplateById(@Res() res: Response) {
    const template = await this.templateService.getTemplateById(res);

    return res.status(HttpStatus.OK).send(template);
  }
}
