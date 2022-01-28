import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Cart } from 'src/cart/cart.entity';
import { Product } from 'src/product/product.entity';
import { Review } from 'src/review/review.entity';
import { Order } from 'src/transaction/order/order.entity';
import { Address } from './addresses/address.entity';

@Table({})
export class User extends Model<User> {
  @Column({
    type: DataType.TEXT,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    validate: {
      isEmail: true,
    },
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  contact_no: string;

  @Column({
    type: DataType.ENUM,
    values: ['Admin', 'Merchant', 'Customer', 'Test', 'Manufacturer'],
    allowNull: false,
  })
  role: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Email Otp',
  })
  email_otp: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Email Otp sent time',
  })
  email_otp_sent_time: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    comment: 'Email Otp verified',
    defaultValue: false,
  })
  email_verified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    comment: 'Merchant Verified',
    defaultValue: false,
  })
  merchant_or_manufacturer_verified: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Razorpay Customer Id',
  })
  rp_customer_id: string;

  @HasMany(() => Address)
  addresses: Address[];

  @HasMany(() => Product)
  products: Product[];

  @HasMany(() => Cart)
  cart: Cart[];

  @HasMany(() => Review)
  reviewes: Review[];

  @HasMany(() => Order, 'userId')
  orders: Order[];

  @HasMany(() => Order, 'merchantId')
  merchantOrders: Order[];

  toJSON() {
    return {
      ...this.get(),
      email_otp: undefined,
      email_otp_sent_time: undefined,
    };
  }
}
