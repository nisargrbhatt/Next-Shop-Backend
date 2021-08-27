import {
  PRODUCT_REPOSITORY,
  REVIEW_REPOSITORY,
  USER_REPOSITORY,
} from 'src/core/constants/constants';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Review } from './review.entity';

export const ReviewProvider = [
  {
    provide: REVIEW_REPOSITORY,
    useValue: Review,
  },
  {
    provide: PRODUCT_REPOSITORY,
    useValue: Product,
  },
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
