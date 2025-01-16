import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/entities/user.entity';
import { Model } from 'mongoose';
import { Recovery } from './entities/recovery.entity';

@Injectable()
export class RecoveryRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Recovery.name) private readonly recoveryModel: Model<Recovery>,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({
      email: email,
    });
  }

  async saveRecoveryCode(
    recoveryCode: number,
    user: string,
  ): Promise<Recovery> {
    const codeExpires = new Date().setMinutes(new Date().getMinutes() + 5);

    return await this.recoveryModel.create({
      recoveryCode: recoveryCode,
      codeExpires: codeExpires,
      user: user,
    });
  }

  async findRecoveryCode(recoveryCode: number): Promise<number> {
    return await this.recoveryModel.countDocuments({
      recoveryCode: recoveryCode,
      codeExpires: { $gt: new Date() },
    });
  }
}
