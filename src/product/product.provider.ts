import {
  CATEGORY_REPOSITORY,
  IMAGE_REPOSITORY,
  PRODUCT_REPOSITORY,
} from 'src/core/constants/constants';
import { Category } from './category/category.entity';
import { Image } from './image/image.entity';
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
    provide: IMAGE_REPOSITORY,
    useValue: Image,
  },
];
