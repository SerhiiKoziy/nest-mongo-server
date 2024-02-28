import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { Response } from 'express';
import { CreateTemplateDto } from './dto/createTemplate.dto';
import { TemplateRepository } from './template.repository';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TemplateService {
  constructor(private readonly templateRepository: TemplateRepository, private authService: AuthService) {}

  async create(createTemplateDto: CreateTemplateDto, session: ClientSession, res: Response) {
    const userId = await this.authService.getUserIdFromToken(res);

    return await this.templateRepository.create(createTemplateDto, session, userId);
  }

  async getTemplateByUserId(res: Response) {
    const userId = await this.authService.getUserIdFromToken(res);

    return await this.templateRepository.getOneByUserId(userId);
  }
}
