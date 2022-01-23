import { Inject, Injectable, Logger } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from 'src/core/constants/constants';
import { CreatePaymentData } from './dto/param.interface';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly PaymentRepository: typeof Payment,
  ) {}

  async create(createPaymentData: CreatePaymentData | any): Promise<Payment> {
    return await this.PaymentRepository.create(createPaymentData);
  }

  async update(
    updatePaymentData: any,
    id: string,
  ): Promise<[number, Payment[]]> {
    return await this.PaymentRepository.update(updatePaymentData, {
      where: { id },
    });
  }

  async findByPk(id: string): Promise<Payment> {
    return await this.PaymentRepository.findByPk(id);
  }

  async findByRpPaymentId(id: string): Promise<Payment> {
    return await this.PaymentRepository.findOne({
      where: {
        rp_payment_id: id,
      },
    });
  }
}
