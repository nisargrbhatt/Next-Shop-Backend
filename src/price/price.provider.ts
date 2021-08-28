import { PRICE_REPOSITORY } from 'src/core/constants/constants';

import { Price } from './price.entity';

export const PriceProvider = [
  {
    provide: PRICE_REPOSITORY,
    useValue: Price,
  },
];
