import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/users/entities/user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async authUser(email: string) {
    return await this.userModel.findOne({ email: email }).select('+password');
  }

  async findUnique(email: string) {
    return await this.userModel.findOne({ email: email });
  }
}
