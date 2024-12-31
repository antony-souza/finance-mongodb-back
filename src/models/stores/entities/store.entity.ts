import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema({ versionKey: false, timestamps: true })
export class StoreEntity {
  @Prop({ type: String, required: false, default: uuidv4 })
  _id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  image_url?: string;

  @Prop({ type: [mongoose.Types.UUID], ref: 'User', required: false })
  users: mongoose.Types.UUID[];

  @Prop({ type: [mongoose.Types.UUID], ref: 'Categories', required: false })
  categories: mongoose.Types.UUID[];

  @Prop({ type: [mongoose.Types.UUID], ref: 'Product', required: false })
  products: mongoose.Types.UUID[];

  @Prop({ type: [mongoose.Types.UUID], required: false })
  sales: mongoose.Types.UUID[];
}

export const StoreSchema = SchemaFactory.createForClass(StoreEntity);
