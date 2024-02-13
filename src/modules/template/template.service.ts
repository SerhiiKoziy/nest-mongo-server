import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CreateTemplateDto } from './dto/createTemplate.dto';
import { TemplateRepository } from './template.repository';

@Injectable()
export class TemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async create(createTemplateDto: CreateTemplateDto, session: ClientSession) {
    return await this.templateRepository.create(createTemplateDto, session);
  }
}
