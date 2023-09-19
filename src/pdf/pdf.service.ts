import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  generatePdf(data: any, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const pdfsFolderPath = path.join(process.cwd(), 'pdfs', filename);

      const stream = fs.createWriteStream(pdfsFolderPath);

      doc.pipe(stream);

      doc.text(`Detail Name: ${data.name}`);
      doc.text(`Detail Description: ${data.detail}`);

      doc.end();

      stream.on('finish', () => {
        resolve();
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
