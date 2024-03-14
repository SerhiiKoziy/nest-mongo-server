import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { Response } from 'express';
import { TemplateRepository } from './template.repository';
import { AuthService } from '../auth/auth.service';
import { UpdateTemplateDto } from './dto/updateTemplate.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class TemplateService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    readonly authService: AuthService,
    readonly userService: UserService,
  ) {}

  async create() {
    return await this.templateRepository.create();
  }

  async update(
    updateTemplateDto: UpdateTemplateDto,
    session: ClientSession,
    res: Response,
  ) {
    const dataUser = await this.authService.getUserFromToken(res);
    let user = await this.userService.getUserByEmail(dataUser.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      return await this.templateRepository.update(
        updateTemplateDto,
        user.template._id.toString(),
        session,
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to update template');
    }
  }

  async getTemplateById(res: Response) {
    const user = await this.authService.getUserFromToken(res);

    return await this.templateRepository.getTemplateById(
      user.template._id.toString(),
    );
  }
}
