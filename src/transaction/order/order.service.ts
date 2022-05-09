import { Inject, Injectable, Logger } from '@nestjs/common';
import { ORDER_REPOSITORY } from 'src/core/constants/constants';
import { Price } from 'src/price/price.entity';
import { Category } from 'src/product/category/category.entity';
import { Image } from 'src/product/image/image.entity';
import { Product } from 'src/product/product.entity';
import { Review } from 'src/review/review.entity';
import { Address } from 'src/user/addresses/address.entity';
import { User } from 'src/user/user.entity';
import { Payment } from '../payment/payment.entity';
import { CreateServerOrderData } from './dto/param.interface';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject(ORDER_REPOSITORY) private readonly OrderRepository: typeof Order,
  ) {}

  async create(createOrderData: CreateServerOrderData | any): Promise<Order> {
    return await this.OrderRepository.create<Order>(createOrderData);
  }

  async update(updateOrderData: any, id: string): Promise<[number]> {
    return await this.OrderRepository.update<Order>(updateOrderData, {
      where: {
        id,
      },
    });
  }

  async findByPk(id: string): Promise<Order> {
    return await this.OrderRepository.findByPk<Order>(id, {
      include: [{ model: Payment }, { model: Price }],
    });
  }

  async findByRpOrderId(id: string): Promise<Order[]> {
    return await this.OrderRepository.findAll<Order>({
      where: {
        rp_order_id: id,
      },
    });
  }

  async findByUserId(
    id: string,
    currentPage: number,
    pageSize: number,
  ): Promise<{ count: number; rows: Order[] }> {
    return await this.OrderRepository.findAndCountAll<Order>({
      where: {
        userId: id,
      },
      include: [
        { model: Product, include: [{ model: Image, limit: 1 }] },
        { model: User, as: 'merchant' },
      ],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });
  }

  async deleteByUser(
    id: string,
    userId: string,
    refundId: string,
  ): Promise<[number]> {
    return await this.OrderRepository.update<Order>(
      {
        order_cancel: true,
        refund_status: true,
        rp_refund_id: refundId,
      },
      {
        where: { id, userId },
      },
    );
  }

  async delete(id: string): Promise<number> {
    return await this.OrderRepository.destroy<Order>({
      where: { id },
      truncate: true,
    });
  }

  async findByOrderPending(): Promise<Order[]> {
    return await this.OrderRepository.findAll<Order>({
      where: {
        order_status: false,
      },
    });
  }

  async findMerchantDecisionPending(
    currentPage: number,
    pageSize: number,
    merchantId: string,
  ): Promise<{
    count: number;
    rows: Order[];
  }> {
    return await this.OrderRepository.findAndCountAll<Order>({
      where: {
        order_status: true,
        order_decision_status: false,
        order_cancel: false,
        merchantId: merchantId,
      },
      include: [
        { model: Product, include: [{ model: Image, limit: 1 }] },
        { model: Address },
        { model: Price },
        { model: User, as: 'user' },
      ],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      col: 'id',
      distinct: true,
    });
  }

  async findMerchantDecisionAccepted(
    currentPage: number,
    pageSize: number,
    merchantId: string,
  ): Promise<{
    count: number;
    rows: Order[];
  }> {
    return await this.OrderRepository.findAndCountAll<Order>({
      where: {
        order_status: true,
        order_decision_status: true,
        order_decision: true,
        order_cancel: false,
        merchantId: merchantId,
      },
      include: [
        { model: Product, include: [{ model: Image, limit: 1 }] },
        { model: Address },
        { model: Price },
        { model: User, as: 'user' },
      ],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      col: 'id',
      distinct: true,
    });
  }

  async findMerchantDecisionRejected(
    currentPage: number,
    pageSize: number,
    merchantId: string,
  ): Promise<{
    count: number;
    rows: Order[];
  }> {
    return await this.OrderRepository.findAndCountAll<Order>({
      where: {
        order_status: true,
        order_decision_status: true,
        order_decision: false,
        order_cancel: false,
        merchantId: merchantId,
      },
      include: [
        { model: Product, include: [{ model: Image, limit: 1 }] },
        { model: Address },
        { model: Price },
        { model: User, as: 'user' },
      ],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      col: 'id',
      distinct: true,
    });
  }

  async findOrderByIdWithData(id: string): Promise<Order> {
    return await this.OrderRepository.findByPk<Order>(id, {
      include: [
        {
          model: Product,
          include: [
            { model: Image, limit: 1 },
            { model: Category },
            { model: Review },
          ],
        },
        { model: Address },
        { model: Price },
        { model: User, as: 'user' },
      ],
    });
  }
}
