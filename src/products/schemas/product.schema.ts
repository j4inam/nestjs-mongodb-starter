import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ProductCategory } from './product-category.schema';
import { timestamps } from 'mongoose-timestamp';

@Schema()
export class Product extends Document {
  @Prop({ type: String, required: true })
  serial: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  weight: number;

  @Prop({ type: String, required: true })
  unit: string;

  @Prop({ type: Number, required: true })
  rate: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true,
  })
  category: ProductCategory;
}

export const ProductSchema = SchemaFactory.createForClass(Product).set(
  'timestamps',
  true,
);
