import { STRING } from 'sequelize';

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
import { User } from 'src/user/user.entity';
import { Category } from './category/category.entity';

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
    type: DataType.ARRAY(STRING),
    allowNull: false,
  })
  photo: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  specification: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Category',
  })
  categoryId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Ownership',
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
}