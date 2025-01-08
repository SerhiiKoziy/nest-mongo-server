import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Template } from './template.model';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateTemplateDto } from './dto/updateTemplate.dto';

export class TemplateRepository {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
  ) {}

  async create() {
    let template: Template;

    try {
      template = await this.templateModel.create({
        firstName: '',
        lastName: '',
        companyName: '',
        companyImage: '',
        bill: '',
        billOwnerName: '',
        country: '',
        town: '',
        postCode: '',
      });

      template = await template.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!template) {
      throw new ConflictException('Template not created');
    }

    return template;
  }

  async update(
    updateTemplateDto: UpdateTemplateDto,
    templateId: string,
    session: ClientSession,
  ) {
    let template: Template;

    try {
      template = await this.templateModel.findOne({ _id: templateId });

      template.firstName = updateTemplateDto.firstName;
      template.lastName = updateTemplateDto.lastName;
      template.companyName = updateTemplateDto.companyName;
      template.companyImage = updateTemplateDto.companyImage;
      template.bill = updateTemplateDto.bill;
      template.billOwnerName = updateTemplateDto.billOwnerName;
      template.country = updateTemplateDto.country;
      template.town = updateTemplateDto.town;
      template.postCode = updateTemplateDto.postCode;

      await template.save({ session });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return template;
  }

  async getTemplateById(
    id: string,
  ): Promise<{ template: Template; message?: string }> {
    let template: Template;
    try {
      template = await this.templateModel.findById({ _id: id }).exec();

      if (!template) {
        return {
          template: undefined,
          message: 'Template not found',
        };
      } else {
        return {
          template: template,
          message: '',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
