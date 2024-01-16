import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import pdf, { CreateOptions } from 'html-pdf';
import path from 'path';
import * as fs from 'fs';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import * as process from 'process';
import { PdfDto } from './dto/pdf.dto';

const pdfsFolderPath = path.join(process.cwd(), 'pdfs');
const htmlTemplatePath = './invoice/products/template.html';
const htmlTemplate = fs.readFileSync(htmlTemplatePath, { encoding: 'utf-8' });

@Injectable()
export class PdfService {
  async generatePdf(data: any, filename: string): Promise<{ filename: string, content: Buffer }> {

    return new Promise((resolve, reject) => {
      const htmlContent = ejs.render(htmlTemplate, {
        name: data.name,
        today: new Date(),
        description: data.description,
        recipientEmail: data.recipientEmail,
        details: data.details
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

  async acceptOffer(pdfDto: PdfDto): Promise<{ message?: string }> {
    try {
      const matchingFile = await this.findPdfFileByPdfId(pdfDto.pdfId);

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

        return { message: 'PDF sent successfully' };
      } else {
        throw new HttpException('Matching file not found or already declined.', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(`Error accepting offer: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async declineOffer(pdfId: string): Promise<{ message: string }> {
    try {
      const matchingFile = await this.findPdfFileByPdfId(pdfId);

      if (matchingFile) {
        const filePath = path.join(pdfsFolderPath, matchingFile);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting file:', unlinkErr);
          }
        });

        return { message: 'Offer declined' };
      } else {
        throw new HttpException('Matching file not found or already declined.', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(`Error declining offer: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  private async findPdfFileByPdfId(pdfId: string): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      fs.readdir(pdfsFolderPath, async (err, files) => {
        if (err) {
          reject(new Error('Error reading directory: ' + err.message));
          return;
        }

        const matchingFile = this.getPfdByID(files, pdfId);
        resolve(matchingFile);
      });
    });
  }

  private getPfdByID (files: string[], pdfId: string) {
    return files.find((file) => file === `${pdfId}.pdf`);
  }
}
