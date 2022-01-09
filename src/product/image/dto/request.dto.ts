import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AddImageDto {
  @ApiProperty({
    type: 'file',
    name: 'image',
    description: 'Image file',
    required: false,
    isArray: true,
    maxItems: 5,
    maxLength: 5,
  })
  @IsOptional()
  image: any[];

  @ApiProperty({
    type: String,
    name: 'productId',
    description: 'Product Id',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID(4)
  productId: string;
}
