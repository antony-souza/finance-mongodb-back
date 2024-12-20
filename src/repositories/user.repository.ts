import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreEntity } from 'src/models/stores/entities/store.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserEntity>,
    @InjectModel('Store') private readonly storeModel: Model<StoreEntity>,
  ) {}

  async createUser(userData: UserEntity): Promise<UserEntity> {
    const createUser = await this.userModel.create(userData);

    if (createUser.store) {
      await this.storeModel.findByIdAndUpdate(
        createUser.store,
        {
          $addToSet: { users: createUser._id },
        },
        { new: true },
      );
    }

    return createUser;
  }

  async getAllUsers() {
    return await this.userModel
      .find()
      .select('_id name email image_url store')
      .populate('store', 'name');
  }

  async getUserById(userId: string): Promise<UserEntity> {
    return await this.userModel
      .findById(userId)
      .select('_id name email image_url')
      .populate('store', 'name');
  }

  async updateUserById(
    userId: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity> {
    return await this.userModel.findByIdAndUpdate(userId, data, { new: true });
  }

  async deleteUserById(userId: string): Promise<UserEntity> {
    const deleteUser = await this.userModel.findByIdAndDelete(userId);

    if (deleteUser.store) {
      await this.storeModel.findByIdAndUpdate(deleteUser.store, {
        $pull: { users: deleteUser._id },
      });
    }
    return;
  }
}
