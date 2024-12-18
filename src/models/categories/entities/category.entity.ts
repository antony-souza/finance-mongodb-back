import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

@Schema()
export class CategoryEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  image_url: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Store', required: true })
  store: StoreEntity;
}
