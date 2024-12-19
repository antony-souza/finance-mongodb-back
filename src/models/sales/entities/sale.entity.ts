import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ProductEntity } from 'src/models/products/entities/product.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';

@Schema({ timestamps: true, collection: 'sales' })
export class SalesEntity extends Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Product', required: true })
  product_id: ProductEntity;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user_id: UserEntity;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Store', required: true })
  store_id: StoreEntity;

  @Prop({ type: Number, required: false })
  totalBilled?: number;

  @Prop({ type: Number, required: true })
  quantitySold: number;

  @Prop({ type: String, default: '00/00/0000' })
  date: string;
}

export const SalesSchema = SchemaFactory.createForClass(SalesEntity);
