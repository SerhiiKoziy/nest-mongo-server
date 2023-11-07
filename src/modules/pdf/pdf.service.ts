import {
  HttpException,
  HttpStatus,
  Injectable,
  Res
} from '@nestjs/common';
import pdf, { CreateOptions } from 'html-pdf';
import path from 'path';
import * as fs from 'fs';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import * as process from 'process';
import { Response } from 'express';
import {PdfDto} from './dto/pdf.dto';

const pdfsFolderPath = path.join(process.cwd(), 'pdfs');
const htmlTemplatePath = './invoice/products/template.html';
const htmlTemplate = fs.readFileSync(htmlTemplatePath, { encoding: 'utf-8' });

@Injectable()
export class PdfService {
  async generatePdf(data: any, filename: string): Promise<{ filename: string, content: Buffer }> {

    return new Promise((resolve, reject) => {

      const htmlContent = ejs.render(htmlTemplate, {
        userName: data.userName,
        today: new Date(),
        productName: data.productName,
        detailID: data.detailID,
        price1: data.price1,
        price2: data.price2,
        productDetails: data.productDetails,
      });

      const pdfOptions: CreateOptions = {
        format: 'A4',
      };

      const pdfFilePath = path.join(pdfsFolderPath, filename);

      pdf.create(htmlContent, pdfOptions).toFile(pdfFilePath, (err) => {

        if (err) {
          reject(err);
        } else {
          const fileContent = fs.readFileSync(pdfFilePath);
          resolve({ filename, content: fileContent });
        }
      });
    })
  }

  async acceptOffer(pdfDto: PdfDto, @Res() res: Response): Promise<void> {
    try {
      const matchingFile = await this.findPdfFile(pdfDto);

      if (matchingFile) {
        const filePath = path.join(pdfsFolderPath, matchingFile);
        const fileContent = fs.readFileSync(filePath);

        const transporter = nodemailer.createTransport({
          service: process.env.MAIL_HOST,
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_USERNAME,
          to: pdfDto.recipientEmail,
          subject: 'Invoice',
          text: 'Please find the attached invoice.',
          attachments: [
            {
              filename: `Invoice: ${pdfDto.pdfId}`,
              content: fileContent,
              contentType: 'application/pdf'
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting file:', unlinkErr);
          }
        });

        res.status(200).json({ message: 'PDF sent successfully' });
      } else {
        throw new HttpException('Matching file not found or already declined.', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(`Error accepting offer: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async declineOffer(pdfDto: PdfDto, @Res() res: Response): Promise<void> {
    try {
      const matchingFile = await this.findPdfFile(pdfDto);

      if (matchingFile) {
        res.status(200).json({ message: 'Offer declined and PDF deleted' });
      } else {
        throw new HttpException('Matching file not found or already declined.', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(`Error declining offer: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  private async findPdfFile(pdfDto: PdfDto): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      fs.readdir(pdfsFolderPath, async (err, files) => {
        if (err) {
          reject(new Error('Error reading directory: ' + err.message));
          return;
        }

        const matchingFile = this.getPfdByID(files, pdfDto.pdfId);
        resolve(matchingFile);
      });
    });
  }

  private getPfdByID (files: string[], pdfId: string) {
    return files.find((file) => file === `${pdfId}.pdf`);
  }
}
