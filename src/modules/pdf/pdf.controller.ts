import { Controller, Post, Body, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Pdfs')
@Controller('pdfs')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @ApiOperation({ summary: 'Create pdfs' })
  @Post('generate')
  async generatePdf(@Body() data: any, @Res() res): Promise<void> {
    const { filename = 'generated.pdf' } = data;

    const pdfBuffer = await this.pdfService.generatePdf(data, filename);
    const pdfBase64 = pdfBuffer.toString('base64');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)

    res.send(pdfBase64);
  }
}
