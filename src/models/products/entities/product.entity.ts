import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CategoriesEntity } from 'src/models/categories/entities/category.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

@Schema()
export class ProductEntity {
  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Number, required: false })
  price: number;

  @Prop({ type: Number, required: false })
  stock: number;

  @Prop({ type: String, required: true })
  image_url: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Categories', required: true })
  categories: CategoriesEntity;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Store', required: true })
  store: StoreEntity;
}

export const ProductSchema = SchemaFactory.createForClass(ProductEntity);
