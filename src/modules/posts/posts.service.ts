import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Post} from "./posts.model";
import {Model} from "mongoose";

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {
  }
  create(dto: CreatePostDto, image) {

  }
}
