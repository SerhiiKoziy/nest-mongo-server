import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateDetailDto } from './dto/createDetail.dto';
import { UpdateDetailDto } from './dto/updateDetail.dto';
import { DetailRepository } from './detail.repository';
import { ClientSession } from 'mongoose';
import {Detail} from './detail.model';

@Injectable()
export class DetailService {
  constructor(private readonly detailRepository: DetailRepository) {}

  async create(createDetailDto: CreateDetailDto, session: ClientSession) {
    const createDetail = await this.detailRepository.createDetail(createDetailDto, session);
    return createDetail;
  }

  getDetail() {
    return [
      {
        name: 'Detail',
        detail: 'Detail Descriptions'
      }
    ]
  }

  findAll() {
    return `This action returns all detail`;
  }

  async findOne(id: string): Promise<Detail> {
    const detail = await this.detailRepository.findOne(id);
    if (!detail) {
      throw new NotFoundException(`Detail with ID ${id} not found`);
    }
    return detail;
  }

  update(id: number, updateDetailDto: UpdateDetailDto) {
    return `This action updates a #${id} detail`;
  }

  remove(id: number) {
    return `This action removes a #${id} detail`;
  }
}
