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
import { User } from 'src/user/user.entity';

@Table({})
export class Cart extends Model<Cart> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1,
      max: 5,
    },
  })
  quantity: number;

  @ForeignKey(() => Price)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Price Id',
  })
  priceId: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Product Id',
  })
  productId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Customer Id',
  })
  userId: string;

  @BelongsTo(() => Price)
  price: Price;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => User)
  user: User;
}
