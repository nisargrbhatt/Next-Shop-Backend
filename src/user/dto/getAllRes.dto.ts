import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class getAllResDto {
  @ApiProperty({})
  userData: Array<User>;
}
