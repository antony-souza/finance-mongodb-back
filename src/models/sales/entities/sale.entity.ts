import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ProductEntity } from 'src/models/products/entities/product.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Schema({ versionKey: false, timestamps: true })
export class SalesEntity {
  @Prop({ type: String, default: uuidv4, required: false })
  _id: string;

  @Prop({ type: String, required: false })
  productName?: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'Product', required: true })
  product_id: ProductEntity;

  @Prop({ type: String, required: false })
  userName?: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'User', required: true })
  user_id: UserEntity;

  @Prop({ type: String, required: false })
  storeName?: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'Store', required: true })
  store_id: StoreEntity;

  @Prop({ type: Number, required: false })
  totalBilled?: number;

  @Prop({ type: Number, required: true })
  quantitySold: number;
}

export const SalesSchema = SchemaFactory.createForClass(SalesEntity);
