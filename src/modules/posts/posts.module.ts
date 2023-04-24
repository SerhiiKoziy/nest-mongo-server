import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './posts.model';
import { MongooseModule } from "@nestjs/mongoose";
import { FilesModule } from "../files/files.module";
import { UserModule } from "../user/user.module";

@Module({
  providers: [PostsService],
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    FilesModule,
    UserModule
  ],
  controllers: [PostsController]
})
export class PostsModule {}
