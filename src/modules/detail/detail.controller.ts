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
import { Connection, Schema as MongooseSchema, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';

import { DetailService } from './detail.service';
import { CreateDetailDto } from './dto/createDetail.dto';
import { UpdateDetailDto } from './dto/updateDetail.dto';
import { Detail } from './detail.model';

@ApiTags('Details')
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
      const newDetail = await this.detailService.create(createDetailDto, session, res)
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
  async getDetailById(@Param('id') id: string, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const objId = new MongooseSchema.Types.ObjectId(id)
      await session.commitTransaction();
      const detail = await this.detailService.getDetailById(objId);

      return res.status(HttpStatus.OK).send(detail);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
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
