// src/auth/auth.controller.ts (ACTUALIZADO)
import { Controller, Post, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService, RegisterMedicoDto } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { Medico } from 'src/medico/entities/medico.entity';
// import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterMedicoDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: { username: string; password: string }) {
        return this.authService.login(loginDto.username, loginDto.password);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        return this.authService.obtenerPerfilCompleto(req.user.id);
    }

    // @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(
        @Request() req: any,
        @Body() updateDto: { user?: Partial<User>; medico?: Partial<Medico> }
    ) {
        return this.authService.actualizarPerfil(
            req.user.id,
            updateDto.user || {},
            updateDto.medico
        );
    }
}
