import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./posts.model";
import { Model } from "mongoose";
import { FilesService } from "../files/files.service";
import { CreatePostDto } from "./dto/createPost.dto";
import { UserService } from "../user/user.service";

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>, private filesService: FilesService, private userService: UserService) {
  }
  async create(dto: CreatePostDto, image: any) {
    const fileName = await this.filesService.createFile(image);
    const user = await this.userService.getUserPrimaryKey(dto.userId);

    const post = await this.postModel.create({ ...dto, userId: user._id, image: fileName });
    await post.save();

    return post;
  }
}
