import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Categories } from 'src/models/categories/entities/category.entity';
import { Product } from 'src/models/products/entities/product.entity';
import { Sales } from 'src/models/sales/entities/sale.entity';
import { User } from 'src/models/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
@Schema({ versionKey: false, timestamps: true })
export class Store {
  @Prop({ type: String, required: false, default: uuidv4 })
  _id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  image_url?: string;

  @Prop({ type: [mongoose.Types.UUID], ref: 'User', required: false })
  users: User[];

  @Prop({ type: [mongoose.Types.UUID], ref: 'Categories', required: false })
  categories: Categories[];

  @Prop({ type: [mongoose.Types.UUID], ref: 'Product', required: false })
  products: Product[];

  @Prop({ type: [mongoose.Types.UUID], ref: 'Sales', required: false })
  sales: Sales[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);
