import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

import { Module } from '@nestjs/common';
import { ReviewProvider } from './review.provider';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ReviewController],
  providers: [ReviewService, ...ReviewProvider],
  exports: [ReviewService],
})
export class ReviewModule {}
