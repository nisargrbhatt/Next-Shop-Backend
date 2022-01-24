import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Price } from 'src/price/price.entity';
import { Product } from 'src/product/product.entity';
import { Address } from 'src/user/addresses/address.entity';
import { User } from 'src/user/user.entity';

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
    comment: 'Order Status - 0=Not Done, 1=Done',
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
}
