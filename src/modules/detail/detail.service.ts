import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { CreateDetailDto } from './dto/createDetail.dto';
import { UpdateDetailDto } from './dto/updateDetail.dto';
import { DetailRepository } from './detail.repository';
import { Detail } from './detail.model';
import { PdfService } from '../../pdf/pdf.service';

@Injectable()
export class DetailService {
  constructor(
    private readonly detailRepository: DetailRepository,
    private  pdfService: PdfService
  ) {}

  async create(createDetailDto: CreateDetailDto, session: ClientSession) {
    const createDetail = await this.detailRepository.createDetail(createDetailDto, session);
    const dynamicFilename = `generated-${Date.now()}.pdf`;
    await this.pdfService.generatePdf(createDetailDto, dynamicFilename);

    return createDetail;
  }

  async getDetailById(id: MongooseSchema.Types.ObjectId): Promise<Detail> {
    const detail = await this.detailRepository.getDetailById(id);
    if (!detail) {
      throw new NotFoundException(`Detail with ID ${id} not found`);
    }
    return detail;
  }

  getAll() {
    return `This action returns all detail`;
  }

  update(id: number, updateDetailDto: UpdateDetailDto) {
    return `This action updates a #${id} detail`;
  }

  remove(id: number) {
    return `This action removes a #${id} detail`;
  }
}
