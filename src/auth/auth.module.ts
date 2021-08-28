import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
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
    JwtModule.register({
      secret: process.env.JWTKEY ? process.env.JWTKEY : 'secret',
      signOptions: { expiresIn: '10d' },
    }),
    ConfigModule,
  ],
  controllers: [],
  providers: [UserService, JwtStrategy, ...AuthProvider],
  exports: [UserService, JwtModule, PassportModule],
})
export class AuthModule {}
