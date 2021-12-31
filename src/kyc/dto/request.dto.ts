import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateKycApprovalDto {
  @ApiProperty({
    type: String,
    name: 'name',
    required: true,
    description: 'Aadhaar Registered Name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    name: 'aadhaar_number',
    required: false,
    description: 'Aadhaar Number',
    maxLength: 12,
    minLength: 12,
  })
  @IsOptional()
  @Length(12, 12)
  aadhaar_number: string;

  @ApiProperty({
    type: String,
    name: 'contact_no',
    required: false,
    description: 'Aadhaar Registered Contact No',
  })
  @IsOptional()
  contact_no: string;

  @ApiProperty({
    type: String,
    name: 'email',
    required: false,
    description: 'Aadhaar Registered Email',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'file',
    isArray: true,
    maxItems: 5,
    name: 'photo',
    description: 'Images of the KYC',
    required: true,
  })
  @IsNotEmpty()
  image: any[];
}

export class AcceptTheKYCApprovalDto {
  @ApiProperty({
    type: String,
    name: 'kycId',
    required: true,
    description: 'KYC Id',
  })
  @IsUUID(4)
  @IsNotEmpty()
  kycId: string;

  @ApiProperty({
    type: Boolean,
    description: 'Admin decision about KYC Approval',
    name: 'approval',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  approval: boolean;

  @ApiProperty({
    type: String,
    description: 'Admin decline reason',
    name: 'declineReason',
    required: false,
  })
  @IsOptional()
  declineReason: string;
}
