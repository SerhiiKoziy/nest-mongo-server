import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Template } from './template.model';
import { CreateTemplateDto } from './dto/createTemplate.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

export class TemplateRepository {
  constructor(@InjectModel(Template.name) private readonly templateModel: Model<Template>) {}

  async create(createTemplateDto: CreateTemplateDto, session: ClientSession) {
    let template = await this.getTemplateById(createTemplateDto.templateId);

    if (template) {
      throw new ConflictException('Template already exists');
    }

    try {
      template = await this.templateModel.create({
        firstName: createTemplateDto.firstName,
        lastName: createTemplateDto.lastName,
        companyName: createTemplateDto.companyName,
        companyImage: createTemplateDto.companyImage,
        bill: createTemplateDto.bill,
        billOwnerName: createTemplateDto.billOwnerName,
        country: createTemplateDto.country,
        town: createTemplateDto.town,
        postCode: createTemplateDto.postCode,
        _id: createTemplateDto.templateId,
      });

      template = await template.save({ session });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!template) {
      throw new ConflictException('Template not created');
    }

    return template;
  }

  async getTemplateById(id: string): Promise<Template> {
    let template: Template;
    try {
      template = await this.templateModel.findById({ _id: id }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return template;
  }
}
