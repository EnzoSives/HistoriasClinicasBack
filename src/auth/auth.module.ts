import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './auth.guard';
@Module({
imports: [UsersModule,
JwtModule.registerAsync({
    global: true,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const secret = config.get<string>('JWT_SECRET');
      if (!secret && config.get<string>('NODE_ENV') === 'production') {
        throw new Error('JWT_SECRET es obligatorio en producción.');
      }
      return {
        secret: secret || randomBytes(32).toString('hex'),
        signOptions: { expiresIn: '1d' },
      };
    },
})
],
controllers: [AuthController],
providers: [AuthService, AuthGuard],
exports: [AuthService, AuthGuard]
})
export class AuthModule {}
