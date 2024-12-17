import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class StoreEntity {
  @Prop({ type: mongoose.Types.ObjectId, required: false })
  id?: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  image_url?: string;

  @Prop({ type: [mongoose.Types.ObjectId], ref: 'User', required: false })
  users: mongoose.Types.ObjectId[];
}

export const StoreSchema = SchemaFactory.createForClass(StoreEntity);
