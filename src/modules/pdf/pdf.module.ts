import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [PdfService],
  controllers: [PdfController],
  exports: [PdfService],
})
export class PdfModule {}
