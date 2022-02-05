import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticService } from './analytic.service';

describe('AnalyticService', () => {
  let service: AnalyticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticService],
    }).compile();

    service = module.get<AnalyticService>(AnalyticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
