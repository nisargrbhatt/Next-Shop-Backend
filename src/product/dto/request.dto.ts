import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    name: 'name',
    description: 'Name of the product',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'file',
    isArray: true,
    maxItems: 5,
    name: 'photo',
    description: 'Images of the product',
    required: true,
  })
  @IsNotEmpty()
  image: any[];

  @ApiProperty({
    type: String,
    description: 'Description of the product',
    name: 'description',
    required: true,
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: String,
    description: 'Specifications of the product',
    name: 'specification',
    required: true,
  })
  @IsNotEmpty()
  specification: string;

  @ApiProperty({
    type: String,
    description: 'Category Id',
    name: 'categoryId',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID(4)
  categoryId: string;
}
