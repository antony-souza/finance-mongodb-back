import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesEntity } from 'src/models/categories/entities/category.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel('Categories')
    private readonly categoriesModel: Model<CategoriesEntity>,
    @InjectModel('Store') private readonly storeModel: Model<StoreEntity>,
  ) {}

  async createCategory(categoryData: CategoriesEntity) {
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

  async updateCategory(id: string, categoryData: Partial<CategoriesEntity>) {
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
}
