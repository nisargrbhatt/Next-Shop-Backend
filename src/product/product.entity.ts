import {
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  Column,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Cart } from 'src/cart/cart.entity';
import { Price } from 'src/price/price.entity';
import { Review } from 'src/review/review.entity';
import { Order } from 'src/transaction/order/order.entity';
import { User } from 'src/user/user.entity';
import { Category } from './category/category.entity';
import { Image } from './image/image.entity';

@Table({})
export class Product extends Model<Product> {
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
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  small_description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  specification: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Decline Count',
    defaultValue: 0,
  })
  decline_count: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Decline Reason',
  })
  decline_reason: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Approval Status',
  })
  approval_status: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    comment: 'Admin approval',
  })
  productApproved: boolean;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Category Id',
  })
  categoryId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Manufacturer Id',
  })
  userId: string;

  @BelongsTo(() => Category)
  category: Category;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Price)
  prices: Price[];

  @HasMany(() => Cart)
  cart: Cart[];

  @HasMany(() => Review)
  reviewes: Review[];

  @HasMany(() => Image)
  images: Image[];

  @HasMany(() => Order)
  orders: Order[];
}
