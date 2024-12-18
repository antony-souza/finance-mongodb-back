import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class StoreEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  image_url?: string;

  @Prop({ type: [mongoose.Types.ObjectId], ref: 'User', required: false })
  users: mongoose.Types.ObjectId[];

  @Prop({ type: [mongoose.Types.ObjectId], ref: 'Categories', required: false })
  categories: mongoose.Types.ObjectId[];
}

export const StoreSchema = SchemaFactory.createForClass(StoreEntity);
