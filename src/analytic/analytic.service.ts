import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  PRICE_REPOSITORY,
  ORDER_REPOSITORY,
  PAYMENT_REPOSITORY,
  KYC_REPOSITORY,
} from 'src/core/constants/constants';
import { KYC } from 'src/kyc/kyc.entity';
import { Price } from 'src/price/price.entity';
import { Order } from 'src/transaction/order/order.entity';
import { Payment } from 'src/transaction/payment/payment.entity';

@Injectable()
export class AnalyticService {
  constructor(
    @Inject(PRICE_REPOSITORY) private readonly PriceRepository: typeof Price,
    @Inject(ORDER_REPOSITORY) private readonly OrderRepository: typeof Order,
    @Inject(PAYMENT_REPOSITORY)
    private readonly PaymentRepository: typeof Payment,
    @Inject(KYC_REPOSITORY) private readonly KYCRepository: typeof KYC,
  ) {}

  //*---- Merchant ----//

  async getAcceptedOrderOfMerchantByMonth(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.OrderRepository.count<Order>({
      where: {
        merchantId,
        order_decision: true,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
  }

  async getRejectedOrderOfMerchantByMonth(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.OrderRepository.count<Order>({
      where: {
        merchantId,
        order_decision_status: true,
        order_decision: false,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
  }

  async getDeliveredOrderOfMerchantByMonth(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.OrderRepository.count<Order>({
      where: {
        merchantId,
        order_decision_status: true,
        order_decision: true,
        delivery_status: true,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
  }

  async getCanceledOrderOfMerchantByMonth(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.OrderRepository.count<Order>({
      where: {
        merchantId,
        order_cancel: true,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
  }

  async getUnpaidOrderOfMerchantByMonth(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.OrderRepository.count<Order>({
      where: {
        merchantId,
        order_status: false,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
  }

  //*---- Admin ----//

  //*---- Manufacturer ----//
  async getPendingOrdersOfManufacturerByMonth(
    manufacturerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.OrderRepository.count<Order>({
      where: {
        manufacturerId,
        order_status: false,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
  }

  async getAcceptedOrdersOfManufacturerByMonth(
    manufacturerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.OrderRepository.count<Order>({
      where: {
        manufacturerId,
        order_status: true,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
  }

  async getCanceledOrdersOfManufacturerByMonth(
    manufacturerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.OrderRepository.count<Order>({
      where: {
        manufacturerId,
        order_cancel: true,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
  }
}
