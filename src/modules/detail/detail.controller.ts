import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { DetailService } from './detail.service';
import { CreateDetailDto } from './dto/createDetail.dto';
import { UpdateDetailDto } from './dto/updateDetail.dto';
import { Detail } from './detail.model';

@Controller('details')
export class DetailController {
  constructor(@InjectConnection() private readonly mongoConnection: Connection, private detailService: DetailService) {}

  @ApiOperation({ summary: 'Create detail' })
  @ApiResponse({ status: 200, type: Detail })
  @Post('/createDetail')
  async create(@Body() createDetailDto: CreateDetailDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const newDetail = await this.detailService.create(createDetailDto, session)
      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send(newDetail);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @ApiOperation({ summary: 'Get detail by id' })
  @ApiResponse({ status: 200, type: Detail })
  @Get('/getDetailById/:id')
  async getDetailById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
    const detail = await this.detailService.getDetailById(id);

    return res.status(HttpStatus.OK).send(detail);
  }

  @Get('/getAll')
  getAll(@Res() res: Response) {
    const details = this.detailService.getAll();

    return res.status(HttpStatus.OK).send(details);
  }

  @Patch('/detail/:id')
  update(@Param('id') id: string, @Body() updateDetailDto: UpdateDetailDto) {
    return this.detailService.update(+id, updateDetailDto);
  }

  @Delete('/detail/:id')
  remove(@Param('id') id: string) {
    return this.detailService.remove(+id);
  }
}
