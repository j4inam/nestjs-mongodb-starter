import { ProductCategory } from '../schemas/product-category.schema';

export class GetProductsResponseDto {
  _id: string;
  serial: string;
  name: string;
  weight: number;
  unit: string;
  rate: number;
  category: ProductCategory;
}
