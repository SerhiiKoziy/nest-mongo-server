import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './posts.model';
import {User, UserSchema} from "../user/user.model";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  providers: [PostsService],
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController]
})
export class PostsModule {}
