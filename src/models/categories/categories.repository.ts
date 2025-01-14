import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categories } from 'src/models/categories/entities/category.entity';
import { Store } from 'src/models/stores/entities/store.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Categories.name)
    private readonly categoriesModel: Model<Categories>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async createCategory(categoryData: Categories) {
    const createCategory = await this.categoriesModel.create(categoryData);

    if (createCategory.store) {
      await this.storeModel.findByIdAndUpdate(
        createCategory.store,
        {
          $addToSet: { categories: createCategory._id },
        },
        { new: true },
      );
    }
    return createCategory;
  }

  async getCategoriesByStore(storeId: string) {
    return await this.categoriesModel.aggregate([
      {
        $match: {
          store: `${storeId}`,
        },
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'store',
          foreignField: '_id',
          as: 'storeData',
        },
      },
      {
        $unwind: {
          path: '$storeData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: '$name',
          image_url: '$image_url',
          storeName: '$storeData.name',
        },
      },
    ]);
  }

  async getCategoryById(id: string) {
    return await this.categoriesModel
      .findById(id)
      .select('_id name image_url store');
  }

  async updateCategory(id: string, categoryData: Partial<Categories>) {
    return await this.categoriesModel.findByIdAndUpdate(id, categoryData, {
      new: true,
    });
  }

  async deleteCategory(id: string) {
    const deleteCategory = await this.categoriesModel.findByIdAndDelete(id);

    if (deleteCategory.store) {
      await this.storeModel.findByIdAndUpdate(deleteCategory.store, {
        $pull: { categories: deleteCategory._id },
      });
    }
    return;
  }

  async searchAllCategoriesFromStoreByName(storeId: string, name: string) {
    return await this.categoriesModel.aggregate([
      {
        $match: {
          store: storeId,
          name: { $regex: name, $options: 'i' },
        },
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'store',
          foreignField: '_id',
          as: 'storeData',
        },
      },
      {
        $unwind: {
          path: '$storeData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: '$name',
          image_url: '$image_url',
          storeName: '$storeData.name',
        },
      },
    ]);
  }
}
