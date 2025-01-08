import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Categories } from 'src/models/categories/entities/category.entity';
import { Store } from 'src/models/stores/entities/store.entity';
import { v4 as uuidv4 } from 'uuid';
@Schema({ versionKey: false, timestamps: true })
export class Product {
  @Prop({ type: String, default: uuidv4, required: false })
  _id?: string;

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

  @Prop({ type: mongoose.Types.UUID, ref: 'Categories', required: true })
  categories: Categories;

  @Prop({ type: mongoose.Types.UUID, ref: 'Store', required: true })
  store: Store;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
