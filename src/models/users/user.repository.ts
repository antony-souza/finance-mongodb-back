import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/models/roles/entities/role.entity';
import { Store } from 'src/models/stores/entities/store.entity';
import { User } from 'src/models/users/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    @InjectModel(Role.name) private readonly rolesModel: Model<Role>,
  ) {}

  async createUser(userData: User): Promise<User> {
    const [checkRoles, checkStores] = await Promise.all([
      await this.rolesModel.findById(userData.role),
      await this.storeModel.findById(userData.store),
    ]);

    if (!checkRoles) {
      throw new NotFoundException('Role not found');
    }

    if (!checkStores) {
      throw new NotFoundException('Store not found');
    }

    const createUser = await this.userModel.create({
      ...userData,
      storeName: checkStores.name,
      roleName: checkRoles.name,
      role: checkRoles._id,
    });

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

  async getUserById(userId: string): Promise<User> {
    return await this.userModel
      .findById(userId)
      .select('_id name email image_url')
      .populate('store', 'name');
  }

  async updateUserById(data: Partial<User>) {
    let checkRole: Role;

    if (data.role) {
      checkRole = await this.rolesModel.findById(data.role);

      if (!checkRole) {
        throw new NotFoundException('Role not found');
      }
    }

    return await this.userModel.updateOne(
      { _id: data._id },
      {
        ...data,
        roleName: checkRole ? checkRole.name : undefined,
      },
    );
  }

  async deleteUserById(userId: string): Promise<User> {
    const deleteUser = await this.userModel.findByIdAndDelete(userId);

    if (deleteUser.store) {
      await this.storeModel.findByIdAndUpdate(deleteUser.store, {
        $pull: { users: deleteUser._id },
      });
    }
    return;
  }

  async getAllUsersByStore(storeId: string) {
    return await this.userModel.aggregate([
      {
        $match: {
          store: `${storeId}`,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          image_url: 1,
          email: 1,
          role: '$roleName',
          store: '$storeName',
        },
      },
    ]);
  }

  async searchUserFromStoreByName(store: string, name: string) {
    return await this.userModel.aggregate([
      {
        $match: {
          store: store,
          name: { $regex: name, $options: 'i' },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: '$name',
          image_url: '$image_url',
          email: '$email',
          role: '$roleName',
          store: '$storeName',
        },
      },
    ]);
  }
}
