import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

@Injectable()
export class StoreRespository {
  constructor(
    @InjectModel('Store') private readonly storeModel: Model<StoreEntity>,
  ) {}

  async createStore(storeData: Partial<StoreEntity>): Promise<StoreEntity> {
    return this.storeModel.create(storeData);
  }

  findAll(): Promise<StoreEntity[]> {
    return this.storeModel
      .find()
      .select('name image_url categories products')
      .populate('categories', 'name')
      .populate('products', 'name');
  }
}
