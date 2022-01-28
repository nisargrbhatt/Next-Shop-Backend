import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Price } from 'src/price/price.entity';
import { Product } from 'src/product/product.entity';
import { Address } from 'src/user/addresses/address.entity';
import { User } from 'src/user/user.entity';
import { Payment } from '../payment/payment.entity';

@Table({})
export class Order extends Model<Order> {
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
    comment: 'Razorpay Order Id',
  })
  rp_order_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Razorpay Customer Id',
  })
  rp_customer_id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    comment: 'Order Payment Status - 0=Not Done, 1=Done',
    defaultValue: false,
  })
  order_status: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'Quantity of product',
    defaultValue: 1,
  })
  quantity: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'RP Options JSON Data',
  })
  rp_prefill_data: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    comment: 'Merchant have taken Decision or not',
    defaultValue: false,
  })
  order_decision_status: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    comment: "Merchant's Decision",
  })
  order_decision: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    comment: 'Delivery Status',
    defaultValue: false,
  })
  delivery_status: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    comment: 'Order Cancelled',
    defaultValue: false,
  })
  order_cancel: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    comment: 'Refund Status',
    defaultValue: false,
  })
  refund_status: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Razorpay Refund Id',
  })
  rp_refund_id: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    comment: 'Final amount',
  })
  amount: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Customer id',
  })
  userId: string;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Address id',
  })
  addressId: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Product id',
  })
  productId: string;

  @ForeignKey(() => Price)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Price Id',
  })
  priceId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Merchant id',
  })
  merchantId: string;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  user: User;

  @BelongsTo(() => Address)
  address: Address;

  @BelongsTo(() => Price)
  price: Price;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => User, {
    foreignKey: 'merchantId',
    as: 'merchant',
  })
  merchant: User;

  @HasMany(() => Payment)
  payment: Payment[];
}
