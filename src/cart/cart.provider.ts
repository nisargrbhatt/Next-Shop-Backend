import {
  CART_REPOSITORY,
  PRICE_REPOSITORY,
  PRODUCT_REPOSITORY,
  USER_REPOSITORY,
} from 'src/core/constants/constants';
import { Price } from 'src/price/price.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Cart } from './cart.entity';

export const CartProvider = [
  {
    provide: PRODUCT_REPOSITORY,
    useValue: Product,
  },
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: PRICE_REPOSITORY,
    useValue: Price,
  },
  {
    provide: CART_REPOSITORY,
    useValue: Cart,
  },
];
