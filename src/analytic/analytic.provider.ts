import {
  PRODUCT_REPOSITORY,
  PRICE_REPOSITORY,
  ORDER_REPOSITORY,
  PAYMENT_REPOSITORY,
  KYC_REPOSITORY,
} from 'src/core/constants/constants';
import { KYC } from 'src/kyc/kyc.entity';
import { Price } from 'src/price/price.entity';
import { Product } from 'src/product/product.entity';
import { Order } from 'src/transaction/order/order.entity';
import { Payment } from 'src/transaction/payment/payment.entity';

export const AnalyticProviders = [
  {
    provide: PRODUCT_REPOSITORY,
    useValue: Product,
  },
  {
    provide: PRICE_REPOSITORY,
    useValue: Price,
  },
  {
    provide: ORDER_REPOSITORY,
    useValue: Order,
  },
  {
    provide: PAYMENT_REPOSITORY,
    useValue: Payment,
  },
  {
    provide: KYC_REPOSITORY,
    useValue: KYC,
  },
];
