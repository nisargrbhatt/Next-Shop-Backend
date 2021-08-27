import {
  CATEGORY_REPOSITORY,
  PRICE_REPOSITORY,
  PRODUCT_REPOSITORY,
} from 'src/core/constants/constants';
import { Price } from 'src/price/price.entity';
import { Category } from './category/category.entity';
import { Product } from './product.entity';

export const ProductProvider = [
  {
    provide: PRODUCT_REPOSITORY,
    useValue: Product,
  },
  {
    provide: CATEGORY_REPOSITORY,
    useValue: Category,
  },
  {
    provide: PRICE_REPOSITORY,
    useValue: Price,
  },
];
