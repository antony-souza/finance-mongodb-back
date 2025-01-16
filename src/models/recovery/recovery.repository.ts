import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class RecoveryRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findUserByEmail(email: string): Promise<number> {
    return await this.userModel.countDocuments({
      email: email,
    });
  }

  async updateRecoveryCode(email: string, recoveryCode: number) {
    return await this.userModel.findByIdAndUpdate(
      {
        email: email,
      },
      {
        recoveryCode: recoveryCode,
      },
    );
  }

  async findUserByRecoveryCode(recoveryCode: number): Promise<number> {
    return await this.userModel.countDocuments({
      recoveryCode: recoveryCode,
    });
  }
}
