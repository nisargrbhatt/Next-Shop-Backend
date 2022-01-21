import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { UserProvider } from './user.provider';

import { AuthModule } from 'src/auth/auth.module';
import { AddressService } from './addresses/address.service';
import { AddressController } from './addresses/address.controller';
import { SharedService } from 'src/shared/shared.service';
import { ConfigModule } from '@nestjs/config';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [UserController, AddressController],
  providers: [
    UserService,
    AddressService,
    SharedService,
    TransactionService,
    ...UserProvider,
  ],
  exports: [UserService, AddressService],
})
export class UserModule {}
