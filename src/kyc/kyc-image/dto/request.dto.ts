import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddKYCImageDto {
  @ApiProperty({
    type: 'file',
    name: 'image',
    description: 'Image file',
    required: true,
    isArray: true,
    maxItems: 5,
    maxLength: 5,
  })
  @IsNotEmpty()
  image: any[];

  @ApiProperty({
    type: String,
    name: 'kycId',
    description: 'KYC Id',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID(4)
  kycId: string;
}
