import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Detail } from './detail.model';
import { CreateDetailDto } from './dto/createDetail.dto';

export class DetailRepository {
  constructor(@InjectModel(Detail.name) private readonly detailModel: Model<Detail>) {}

  async createDetail(createDetailDto: CreateDetailDto, session: ClientSession) {
    let detail = await this.findDetailByName(createDetailDto.name);

    if (detail) {
      throw new ConflictException('Detail already exists');
    }

    try {
      detail = await this.detailModel.create({
        name: createDetailDto.name,
        description: createDetailDto.description,
        recipientEmail: createDetailDto.recipientEmail,
        details: createDetailDto.details
      });

      detail = await detail.save({ session });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!detail) {
      throw new ConflictException('Detail not created');
    }

    return detail;
  }

  async findDetailByName(name: string): Promise<Detail | null> {
    let detail: Detail;

    try {
      detail = await this.detailModel.findOne({ name: name }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return detail;
  }

  async getDetailById(id: string): Promise<Detail> {
    let detail: Detail;
    try {
      detail = await this.detailModel.findById({ _id: id }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!detail) {
      throw new NotFoundException('Detail not found');
    }

    return detail;
  }
}
