import { IsString } from 'class-validator';

export class PdfDto {
  @IsString()
  pdfId: string
  @IsString()
  recipientEmail: string
}
