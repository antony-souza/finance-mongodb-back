import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from 'src/models/stores/entities/store.entity';

@Injectable()
export class StoreRespository {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async createStore(storeData: Partial<Store>): Promise<Store> {
    return this.storeModel.create(storeData);
  }

  findAll(): Promise<Store[]> {
    return this.storeModel
      .find()
      .select('name image_url categories products')
      .populate('categories', 'name')
      .populate('products', 'name');
  }
}
