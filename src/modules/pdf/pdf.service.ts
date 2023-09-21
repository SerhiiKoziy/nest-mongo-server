import { Injectable } from '@nestjs/common';
import pdf, { CreateOptions } from 'html-pdf';
import path from 'path';
import * as fs from 'fs';

import HtmlTemplate from '../../../invoice/products/template';

@Injectable()
export class PdfService {
  generatePdf(data: any, filename: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const pdfsFolderPath = path.join(process.cwd(), 'pdfs', filename);

      const htmlContent = HtmlTemplate(data);

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
