import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from 'src/models/auth/dto/create-auth.dto';
import { UpdateAuthDto } from 'src/models/auth/dto/update-auth.dto';
import { UserEntity } from 'src/models/users/entities/user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserEntity>,
  ) {}

  async authUser(dto: CreateAuthDto) {
    return await this.userModel
      .findOne({ email: dto.email })
      .select('name email image_url');
  }

  async findUnique(dto: UpdateAuthDto) {
    return await this.userModel.findOne({ email: dto.email });
  }
}
