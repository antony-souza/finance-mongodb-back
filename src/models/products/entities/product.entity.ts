import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ProductEntity {
  @Prop({ type: String, required: false })
  name: string;
}
