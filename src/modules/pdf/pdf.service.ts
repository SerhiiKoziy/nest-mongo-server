import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import path from 'path';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as process from 'process';
import * as handlebars from 'handlebars';

import { PdfDto } from './dto/pdf.dto';
import { Invoice } from '../invoice/invoice.model';

const pdfsFolderPath = path.join(process.cwd(), 'pdfs');
const htmlTemplatePath = path.join(process.cwd(), 'invoice', 'products', 'template.html');
const htmlTemplate = fs.readFileSync(htmlTemplatePath, { encoding: 'utf-8' });

@Injectable()
export class PdfService {
  async generatePDF(data: Invoice, filename: string): Promise<Buffer> {
    try {
      const compiledTemplate = handlebars.compile(htmlTemplate);

      handlebars.registerHelper('inc', function (value, options) {
        return parseInt(value) + 1;
      });
      handlebars.registerHelper('multiply', function (a: number, b: number, options) {
        return a * b;
      });
      handlebars.registerHelper('calculateTotal', function (details: any[], options) {
        return details.reduce((total, product) => {
          const count = parseFloat(product.count);
          const price = parseFloat(product.price);
          return total + count * price;
        }, 0);
      });

      const dataTemplate = {
        name: data.name,
        description: data.description,
        recipientEmail: data.recipientEmail,
        details: data.details,
        today: new Date().toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      const htmlContent = compiledTemplate(dataTemplate);

      const browser = await puppeteer.launch({
        headless: 'new',
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent);

      return await page.pdf({ path: path.join(pdfsFolderPath, filename), format: 'A4' });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
              contentType: 'application/pdf',
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

  private getPfdByID(files: string[], pdfId: string) {
    return files.find((file) => file === `${pdfId}.pdf`);
  }
}
