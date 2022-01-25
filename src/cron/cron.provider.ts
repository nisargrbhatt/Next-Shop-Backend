import {
  ORDER_REPOSITORY,
  PAYMENT_REPOSITORY,
} from 'src/core/constants/constants';

import { Order } from 'src/transaction/order/order.entity';
import { Payment } from 'src/transaction/payment/payment.entity';

export const CronProviders = [
  {
    provide: ORDER_REPOSITORY,
    useValue: Order,
  },
  {
    provide: PAYMENT_REPOSITORY,
    useValue: Payment,
  },
];
