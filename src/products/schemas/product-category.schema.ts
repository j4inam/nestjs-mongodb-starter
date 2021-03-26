import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ProductCategory extends Document {
  @Prop({ type: String, required: true })
  title: string;
}

export const ProductCategorySchema = SchemaFactory.createForClass(
  ProductCategory,
).set('timestamps', true);
