import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class UserEntity {
  @Prop({ type: String, required: false })
  id?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  image_url: string;

  @Prop({ type: Date, required: false, default: Date.now })
  createdAt?: Date;

  @Prop({ type: Date, required: false, default: Date.now })
  updatedAt?: Date;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Store', required: false })
  store_id?: string | mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
