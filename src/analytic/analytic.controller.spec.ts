import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticController } from './analytic.controller';

describe('AnalyticController', () => {
  let controller: AnalyticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticController],
    }).compile();

    controller = module.get<AnalyticController>(AnalyticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
