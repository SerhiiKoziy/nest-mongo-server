import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostsService } from "./posts.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreatePostDto } from "./dto/createPost.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Post as PostModel } from "./posts.model";

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}


  @ApiOperation({ summary: 'Create Post' })
  @ApiResponse({ status: 200, type: PostModel })
  @Post('/createPost')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(@Body() dto: CreatePostDto, @UploadedFile() image) {
    return await this.postService.create(dto, image);
  }
}
