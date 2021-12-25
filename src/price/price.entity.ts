import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Cart } from 'src/cart/cart.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';

@Table({})
export class Price extends Model<Price> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      max: 100,
      min: 0,
    },
  })
  stock: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Merchant Id',
  })
  merchantId: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Product Id',
  })
  productId: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;

  @HasMany(() => Cart)
  cart: Cart[];
}
