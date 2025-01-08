import { forwardRef, Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgotPassword.service';
import { UserModule } from '../user/user.module';
import { ForgotPassword, ForgotPasswordSchema } from './forgotPassword.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ForgotPassword.name, schema: ForgotPasswordSchema }]),
    forwardRef(() => UserModule)],
  providers: [ForgotPasswordService],
  exports: [ForgotPasswordService],
})
export class ForgotPasswordModule {}
