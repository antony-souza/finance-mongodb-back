import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from 'src/models/products/entities/product.entity';
import { Store } from 'src/models/stores/entities/store.entity';
import { User } from 'src/models/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Schema({ versionKey: false, timestamps: true })
export class Sales {
  @Prop({ type: String, default: uuidv4, required: false })
  _id: string;

  @Prop({ type: String, required: false })
  productName?: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'Product', required: true })
  product_id: Product;

  @Prop({ type: String, required: false })
  userName?: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'User', required: true })
  user_id: User;

  @Prop({ type: String, required: false })
  storeName?: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'Store', required: true })
  store_id: Store;

  @Prop({ type: Number, required: false })
  totalBilled?: number;

  @Prop({ type: Number, required: true })
  quantitySold: number;
}

export const SalesSchema = SchemaFactory.createForClass(Sales);
