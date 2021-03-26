import { Controller, Get } from '@nestjs/common';
import { GetProductCategoriesReesponseDto } from './dto/get-product-categories-response.dto';
import { GetProductsResponseDto } from './dto/get-products-response.dto';
import { ProductCategoriesService } from './product-categories.service';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private productCategoriesService: ProductCategoriesService,
  ) {}

  @Get()
  async getAllProducts(): Promise<GetProductsResponseDto[]> {
    return this.productsService.findAll();
  }

  @Get('/categories')
  async getAllProductCateogries(): Promise<GetProductCategoriesReesponseDto[]> {
    return this.productCategoriesService.findAll();
  }
}
