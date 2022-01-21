import {
  ADDRESS_REPOSITORY,
  ORDER_REPOSITORY,
  PAYMENT_REPOSITORY,
  PRICE_REPOSITORY,
  PRODUCT_REPOSITORY,
} from 'src/core/constants/constants';
import { Price } from 'src/price/price.entity';
import { Product } from 'src/product/product.entity';
import { Address } from 'src/user/addresses/address.entity';
import { Order } from './order/order.entity';
import { Payment } from './payment/payment.entity';

export const TransactionProviders = [
  {
    provide: ORDER_REPOSITORY,
    useValue: Order,
  },
  {
    provide: PAYMENT_REPOSITORY,
    useValue: Payment,
  },
  {
    provide: PRODUCT_REPOSITORY,
    useValue: Product,
  },
  {
    provide: PRICE_REPOSITORY,
    useValue: Price,
  },
  {
    provide: ADDRESS_REPOSITORY,
    useValue: Address,
  },
];
