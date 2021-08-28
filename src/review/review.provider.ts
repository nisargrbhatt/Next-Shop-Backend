import { REVIEW_REPOSITORY } from 'src/core/constants/constants';

import { Review } from './review.entity';

export const ReviewProvider = [
  {
    provide: REVIEW_REPOSITORY,
    useValue: Review,
  },
];
