import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { KYC } from '../kyc.entity';

@Table({})
export class KYCImage extends Model<KYCImage> {
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
  url: string;

  @ForeignKey(() => KYC)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'KYC Id',
  })
  kycId: string;

  @BelongsTo(() => KYC)
  kyc: KYC;
}
