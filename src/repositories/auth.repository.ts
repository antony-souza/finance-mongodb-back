import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateAuthDto } from 'src/models/auth/dto/update-auth.dto';
import { UserEntity } from 'src/models/users/entities/user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserEntity>,
  ) {}

  async authUser(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async findUnique(email: string) {
    return await this.userModel.findOne({ email: email });
  }
}
