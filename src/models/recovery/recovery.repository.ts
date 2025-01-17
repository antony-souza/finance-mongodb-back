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

  async findUserById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async saveRecoveryCode(
    user: string,
    recoveryCode: number,
  ): Promise<Recovery> {
    const codeExpires = new Date().setMinutes(new Date().getMinutes() + 10);

    return await this.recoveryModel.create({
      recoveryCode: recoveryCode,
      codeExpires: codeExpires,
      user: user,
    });
  }

  async disableRecoveryCode(id: string) {
    return await this.recoveryModel.findByIdAndUpdate(id, {
      enabled: false,
    });
  }

  async validateRecoveryCode(recoveryCode: number): Promise<Recovery> {
    const recovery = await this.recoveryModel.findOne({
      recoveryCode: recoveryCode,
      codeExpires: { $gt: new Date() },
      enabled: true,
    });

    return recovery;
  }

  async updatePasswordForRecovery(data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(data._id, {
      password: data.password,
    });
  }
}
