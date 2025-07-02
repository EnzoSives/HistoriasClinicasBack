import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { jwtConstants } from './constants/constants';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Medico } from 'src/medico/entities/medico.entity';
import { UsersModule } from 'src/users/users.module';
@Module({
imports: [UsersModule, User, Medico,
JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1d'},
})
],
controllers: [AuthController],
providers: [AuthService],
exports: [AuthService]
})
export class AuthModule {}