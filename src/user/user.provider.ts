import { Address } from './addresses/address.entity';
import {
  ADDRESS_REPOSITORY,
  CART_REPOSITORY,
  PRODUCT_REPOSITORY,
} from './../core/constants/constants';
import { USER_REPOSITORY } from 'src/core/constants/constants';
import { User } from './user.entity';
import { Product } from 'src/product/product.entity';
import { Cart } from 'src/cart/cart.entity';

export const UserProvider = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: ADDRESS_REPOSITORY,
    useValue: Address,
  },
  {
    provide: PRODUCT_REPOSITORY,
    useValue: Product,
  },
  {
    provide: CART_REPOSITORY,
    useValue: Cart,
  },
];
