import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ProductEntity } from 'src/models/products/entities/product.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'sales' })
export class SalesEntity extends Document {
  @Prop({ type: String, default: uuidv4, required: false })
  _id: string;

  @Prop({ type: String, required: true })
  productName: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'Product', required: true })
  product_id: ProductEntity;

  @Prop({ type: String, required: true })
  userName: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'User', required: true })
  user_id: UserEntity;

  @Prop({ type: String, required: true })
  storeName: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'Store', required: true })
  store_id: StoreEntity;

  @Prop({ type: Number, required: false })
  totalBilled?: number;

  @Prop({ type: Number, required: true })
  quantitySold: number;

  @Prop({ type: String, default: Date.now(), required: false })
  date?: Date;
}

export const SalesSchema = SchemaFactory.createForClass(SalesEntity);
