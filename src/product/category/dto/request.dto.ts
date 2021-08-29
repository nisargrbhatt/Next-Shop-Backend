import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddCategoryDto {
  @ApiProperty({
    type: String,
    name: 'name',
    required: true,
    description: 'Category name',
  })
  @IsNotEmpty()
  name: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    type: String,
    name: 'name',
    required: true,
    description: 'Category name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    name: 'categoryId',
    required: true,
    description: 'Category Id',
  })
  @IsUUID(4)
  @IsNotEmpty()
  categoryId: string;
}
