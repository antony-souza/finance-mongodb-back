import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Store } from 'src/models/stores/entities/store.entity';
import { v4 as uuidv4 } from 'uuid';
@Schema({ versionKey: false, timestamps: true })
export class Categories {
  @Prop({ type: String, required: false, default: uuidv4 })
  _id?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  image_url: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'Store', required: true })
  store: Store;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
