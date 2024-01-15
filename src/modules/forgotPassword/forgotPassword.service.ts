import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import process from 'process';
import { InjectModel } from '@nestjs/mongoose';

import { UserService } from '../user/user.service';
import { ForgotPassword } from './forgotPassword.model';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerificationCodeDto } from './dto/verificationCode.dto';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectModel(ForgotPassword.name) private passwordResetCodeModel: Model<ForgotPassword>,
    private userService: UserService,
  ) {}

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      let generateVerificationCode = await this.generateCode(6);
      const existingUser = await this.userService.getUserByEmail(dto.email);

      if (!existingUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const existingCode = await this.passwordResetCodeModel.findOne({ email: dto.email });
      if (existingCode) {
        await this.updateVerificationCode({ email: dto.email, code: generateVerificationCode });
      } else {
        await this.passwordResetCodeModel.create({
          email: dto.email,
          verificationCode: generateVerificationCode,
        });
      }

      await this.sendVerificationCodeEmail(dto.email, generateVerificationCode);

      return { message: 'Verification code sent' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email, newPassword, verificationCode } = dto;

    try {
      const verificationResult = await this.validateVerificationCode({ email, code: verificationCode });

      if (!verificationResult.isValid) {
        throw new HttpException(verificationResult.message, HttpStatus.BAD_REQUEST);
      }

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 5);
      user.password = hashedPassword;
      await this.userService.updateUser(user);
      await this.passwordResetCodeModel.deleteOne({ email });

      return { message: 'Password reset successful' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Failed to reset password', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async validateVerificationCode(dto: VerificationCodeDto): Promise<{ isValid: boolean, message?: string }> {
    const { email, code } = dto;

    try {
      const latestCode = await this.passwordResetCodeModel
        .findOne({ email })
        .sort({ createdAt: -1 })
        .exec();

      if (!latestCode) {
        return { isValid: false, message: 'Verification code not found' };
      }

      if (code !== latestCode.verificationCode) {
        return { isValid: false, message: 'Invalid verification code' };
      }

      const expirationTime = latestCode.createdAt.getTime() + 30 * 60 * 1000;
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        return { isValid: false, message: 'Verification code has expired' };
      }

      return { isValid: true, message: 'Verification code is valid' };
    } catch (error) {
      throw new HttpException('Failed to validate verification code', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async updateVerificationCode(dto: VerificationCodeDto){
    const { email, code } = dto;
    await this.passwordResetCodeModel.findOneAndUpdate(
      { email },
      {$set: { verificationCode: code, createdAt: new Date() }},
    );
  }

  private async generateCode(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    return result;
  }

  private async sendVerificationCodeEmail(email: string, verificationCode: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const expirationTimeInMinutes = 30;

      const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: email,
        subject: 'Password Reset Verification Code',
        text: `Your verification code is: ${verificationCode}\n\n` +
          `This code will be valid for the next ${expirationTimeInMinutes} minutes. ` +
          `If you don't use it within this time, you'll need to request a new verification code.`,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new HttpException('Failed to send verification code email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
