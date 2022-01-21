import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from 'src/transaction/order/order.entity';
import { User } from '../user.entity';

@Table({})
export class Address extends Model<Address> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  address_line1: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  address_line2: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  state: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  zipcode: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  contact_no: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Order)
  orders: Order[];
}
