import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DetailService } from './detail.service';
import { CreateDetailDto } from './dto/createDetail.dto';
import { Detail } from './detail.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Details')
@Controller('details')
export class DetailController {
  constructor(@InjectConnection() private readonly mongoConnection: Connection, private detailService: DetailService) {}

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create detail' })
  @ApiResponse({ status: 200, type: Detail })
  @Post('/createDetail')
  async create(@Body() createDetailDto: CreateDetailDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const newDetail = await this.detailService.create(createDetailDto, session, res)
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(newDetail);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get detail by id' })
  @ApiResponse({ status: 200, type: Detail })
  @Get('/getDetailById/:id')
  async getDetailById(@Param('id') id: string, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      await session.commitTransaction();
      const detail = await this.detailService.getDetailById(id);

      return res.status(HttpStatus.OK).send(detail);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @Delete('/detail/:id')
  remove(@Param('id') id: string) {
    return this.detailService.remove(+id);
  }
}
