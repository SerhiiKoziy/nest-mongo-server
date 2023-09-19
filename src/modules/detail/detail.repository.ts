import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Detail } from './detail.model';
import { CreateDetailDto } from './dto/createDetail.dto';

export class DetailRepository {
  constructor(@InjectModel(Detail.name) private readonly detailModel: Model<Detail>) {}

  async createDetail(createDetailDto: CreateDetailDto, session: ClientSession) {
    let detailProposal = await this.findDetailByName(createDetailDto.name);

    if (detailProposal) {
      throw new ConflictException('Detail already exists');
    }

    let detail = new this.detailModel({
      name: createDetailDto.name,
      detail: createDetailDto.detail,
    });

    try {
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
    try {
      const detail = await this.detailModel.findOne({ name }).exec();
      return detail;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Detail> {
    const detail = await this.detailModel.findById(id);
    if (!detail) {
      throw new InternalServerErrorException(`Detail with ID ${id} not found`);
    }
    return detail;
  }
}
