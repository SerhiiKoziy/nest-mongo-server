import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, BadRequestException } from '@nestjs/common';
import { DetailService } from './detail.service';
import { CreateDetailDto } from './dto/createDetail.dto';
import { UpdateDetailDto } from './dto/updateDetail.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
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
      const newDetail = this.detailService.create(createDetailDto, session)
      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send(newDetail);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @Get()
  getDetail() {
    return this.detailService.getDetail();
  }

  @Get()
  findAll() {
    return this.detailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const detail =  this.detailService.findOne(id);

    return detail
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetailDto: UpdateDetailDto) {
    return this.detailService.update(+id, updateDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailService.remove(+id);
  }
}
