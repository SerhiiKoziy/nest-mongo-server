import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ForgotPasswordModule } from '../forgotPassword/forgotPassword.module';
import { TemplateModule } from '../template/template.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ForgotPasswordModule,
    TemplateModule,
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
