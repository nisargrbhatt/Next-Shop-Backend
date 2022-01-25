import { Inject, Injectable, Logger } from '@nestjs/common';
import { ORDER_REPOSITORY } from 'src/core/constants/constants';
import { Image } from 'src/product/image/image.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
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

  async update(updateOrderData: any, id: string): Promise<[number, Order[]]> {
    return await this.OrderRepository.update<Order>(updateOrderData, {
      where: {
        id,
      },
    });
  }

  async findByPk(id: string): Promise<Order> {
    return await this.OrderRepository.findByPk<Order>(id);
  }

  async findByRpOrderId(id: string): Promise<Order> {
    return await this.OrderRepository.findOne<Order>({
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

  async delete(id: string, userId: string): Promise<number> {
    return await this.OrderRepository.destroy<Order>({
      where: { id, userId },
      truncate: true,
    });
  }

  async deleteOrder(id: string): Promise<number> {
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
}
