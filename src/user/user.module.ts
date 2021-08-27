import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { UserProvider } from './user.provider';

import { AuthModule } from 'src/auth/auth.module';
import { AddressService } from './addresses/address.service';
import { AddressController } from './addresses/address.controller';

@Module({
  imports: [AuthModule],
  controllers: [UserController, AddressController],
  providers: [UserService, AddressService, ...UserProvider],
  exports: [UserService, AddressService],
})
export class UserModule {}
