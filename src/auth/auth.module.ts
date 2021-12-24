import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthProvider } from './auth.provider';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    ConfigModule,
  ],
  controllers: [],
  providers: [UserService, JwtStrategy, ...AuthProvider],
  exports: [UserService, PassportModule],
})
export class AuthModule {}
