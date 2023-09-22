import { Injectable } from '@nestjs/common';
import pdf, { CreateOptions } from 'html-pdf';
import path from 'path';
import * as fs from 'fs';
import ejs from 'ejs';

const htmlTemplatePath = './invoice/products/template.html';
const htmlTemplate = fs.readFileSync(htmlTemplatePath, { encoding: 'utf-8' });

@Injectable()
export class PdfService {

  generatePdf(data: any, filename: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const pdfsFolderPath = path.join(process.cwd(), 'pdfs', filename);

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

      pdf.create(htmlContent, pdfOptions).toFile(pdfsFolderPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(fs.readFileSync(pdfsFolderPath));
        }
      });
    });
  }
}
