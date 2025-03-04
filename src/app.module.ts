import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ClientModule } from './modules/client/client.module';
import { ProductModule } from './modules/product/product.module';
import { SaleModule } from './modules/sale/sale.module';
import { UserModule } from './modules/user/user.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { FilesModule } from './modules/files/files.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { TemplateModule } from './modules/template/template.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule,
    // MongoDB Connection
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.getMongoConfig(),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'uploads'),
    }),
    ClientModule,
    ProductModule,
    SaleModule,
    UserModule,
    RolesModule,
    AuthModule,
    PostsModule,
    FilesModule,
    InvoiceModule,
    PdfModule,
    TemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
