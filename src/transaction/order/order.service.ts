import { Inject, Injectable, Logger } from '@nestjs/common';
import { ORDER_REPOSITORY } from 'src/core/constants/constants';
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
}
