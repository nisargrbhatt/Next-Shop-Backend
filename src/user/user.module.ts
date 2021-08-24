import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { UserProvider } from './user.provider';

import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, ...UserProvider],
  exports: [UserService],
})
export class UserModule {}
