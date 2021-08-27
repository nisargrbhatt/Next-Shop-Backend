import {
  PRODUCT_REPOSITORY,
  USER_REPOSITORY,
} from 'src/core/constants/constants';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';

export const PriceProvider = [
  {
    provide: PRODUCT_REPOSITORY,
    useValue: Product,
  },
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
