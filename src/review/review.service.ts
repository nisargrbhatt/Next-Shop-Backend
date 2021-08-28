import { Inject, Injectable } from '@nestjs/common';
import { REVIEW_REPOSITORY } from 'src/core/constants/constants';
import { User } from 'src/user/user.entity';
import { createReviewData } from './dto/param.interface';
import { Review } from './review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(REVIEW_REPOSITORY) private readonly ReviewRepository: typeof Review,
  ) {}

  async create(createReviewData: createReviewData | any): Promise<Review> {
    return await this.ReviewRepository.create<Review>(createReviewData);
  }

  async update(
    updateReviewData: any,
    id: string,
    userId: string,
  ): Promise<any> {
    return await this.ReviewRepository.update<Review>(updateReviewData, {
      where: {
        id,
        userId,
      },
    });
  }

  async findByPk(id: string): Promise<Review> {
    return await this.ReviewRepository.findByPk<Review>(id);
  }

  async findByProductId(
    productId: string,
  ): Promise<{ count: number; rows: Review[] }> {
    return await this.ReviewRepository.findAndCountAll({
      where: {
        productId,
      },
      include: [{ model: User }],
    });
  }
}
