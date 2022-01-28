import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from '../order/order.entity';

@Table({})
export class Payment extends Model<Payment> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Razorpay Payment Id',
  })
  rp_payment_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Razorpay Order Id',
  })
  rp_order_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Razorpay Signature',
  })
  rp_signature: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Order Id',
  })
  orderId: string;

  @BelongsTo(() => Order)
  order: Order;
}
